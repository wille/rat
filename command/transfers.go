package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
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

	fp *os.File
}

var Transfers = make([]Transfer, 0)

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
	}

	return n, err
}

func (t *Transfer) Read(b []byte) (int, error) {
	n, err := t.fp.Read(b)

	if err == nil {
		t.Offset += int64(n)
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

	return &Transfer{
		Local:    tmpf,
		Remote:   remote,
		Download: download,
		Len:      len,
		Offset:   0,
	}
}
