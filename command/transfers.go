package main

import (
	"io"
	"io/ioutil"
	"path/filepath"
	"time"
)

type TransferState uint8

const (
	StateInProgress TransferState = iota
	StatePaused
	StateCancelled
	StateDeleted
	StateWaiting
	StateComplete
	StateError
)

type Transfer struct {
	// Unique transfer ID
	ID string

	// Local file on server
	Local string

	// Remote file on client system
	Remote string

	// Download (to server) or upload (to client)
	Download bool

	// Offset is the number of bytes received and written
	Offset int64

	// Len is total size of file in bytes
	Len int64

	// Bps bytes per second
	Bps int64

	State TransferState
	Error error

	// bytes per second counter
	counter int64
	ts      time.Time
	reader  io.ReadCloser
	writer  io.WriteCloser
}

var Transfers = make([]*Transfer, 0)
var TransferChannel = make(chan *Transfer)

func init() {
	go func() {
		for {
			select {
			case t := <-TransferChannel:
				Transfers = append(Transfers, t)
				broadcast(TransferUpdateMessage(*t))
			case <-time.After(time.Second):
				for _, t := range Transfers {
					t.calcRate()
					broadcast(TransferUpdateMessage(*t))
				}
			}
		}
	}()
}

func (t *Transfer) calcRate() {
	duration := time.Since(t.ts)
	t.Bps = t.counter / int64(duration.Seconds())
	t.ts = time.Now()
	t.counter = 0
}

func (t *Transfer) Start(client *Client, controller *Controller) {
	client.streamChan <- ChannelTransfer{
		t,
		controller,
	}
}

func (t *Transfer) Write(b []byte) (int, error) {
	n, err := t.writer.Write(b)

	if err == nil {
		t.Offset += int64(n)
		t.counter += int64(n)
	}

	return n, err
}

func (t *Transfer) Read(b []byte) (int, error) {
	n, err := t.reader.Read(b)

	if err == nil {
		t.Offset += int64(n)
		t.counter += int64(n)
	}

	return n, err
}

func (t *Transfer) Close() error {
	if t.reader != nil {
		return t.reader.Close()
	}

	if t.writer != nil {
		return t.writer.Close()
	}

	return nil
}

// NewTransfer creates a new transfer stored in a temporary file
func NewTransfer(remote string, len int64, download bool) *Transfer {
	dir, _ := ioutil.TempDir("", "transfers")
	tmpf := filepath.Join(dir, filepath.Base(remote))

	t := &Transfer{
		ID:       randomPassword(),
		Local:    tmpf,
		Remote:   remote,
		Download: download,
		Len:      len,
		Offset:   0,
	}

	TransferChannel <- t
	return t
}
