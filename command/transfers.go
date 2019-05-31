package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"time"
)

type Transfer struct {
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

	// bytes per second counter
	counter int64
	ts      time.Time
	fp      *os.File
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

func (t *Transfer) Start(c *Client) {
	c.streamChan <- ChannelTransfer{
		t,
	}
}

// Open the local file for reading or writing
func (t *Transfer) Open(write bool) error {
	fp, err := os.OpenFile(t.Local, os.O_RDWR|os.O_CREATE, 0666)
	t.fp = fp

	if t.Offset > 0 {
		_, err = fp.Seek(t.Offset, io.SeekStart)
		if err != nil {
			panic(err)
		}
	}

	return err
}

func (t *Transfer) Write(b []byte) (int, error) {
	n, err := t.fp.Write(b)

	if err == nil {
		t.Offset += int64(n)
		t.counter += int64(n)
	}

	return n, err
}

func (t *Transfer) Read(b []byte) (int, error) {
	n, err := t.fp.Read(b)

	if err == nil {
		t.Offset += int64(n)
		t.counter += int64(n)
	}

	return n, err
}

func (t *Transfer) Close() error {
	t.fp.Sync()
	return t.fp.Close()
}

// NewTransfer creates a new transfer stored in a temporary file
func NewTransfer(remote string, len int64, download bool) *Transfer {
	dir, _ := ioutil.TempDir("", "transfers")
	tmpf := filepath.Join(dir, filepath.Base(remote))

	fmt.Println("transferring", download, "remote", remote, "to", tmpf)

	t := &Transfer{
		Local:    tmpf,
		Remote:   remote,
		Download: download,
		Len:      len,
		Offset:   0,
	}

	TransferChannel <- t
	return t
}
