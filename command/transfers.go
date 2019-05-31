package main

import (
	"fmt"
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
}

var Transfers = make([]Transfer, 0)

func (t *Transfer) Start(c *Client) {
	c.streamChan <- ChannelTransfer{
		t,
	}
}

// Open the local file for reading or writing
func (t *Transfer) Open() (*os.File, error) {
	var mode int

	if t.Download {
		mode = os.O_RDWR | os.O_CREATE
	} else {
		mode = os.O_RDONLY
	}

	return os.OpenFile(t.Local, mode, 0666)
}

func NewTransfer(remote string, len int64, download bool) *Transfer {
	dir, _ := ioutil.TempDir("", "transfers")
	tmpf := filepath.Join(dir, filepath.Base(remote))

	fmt.Println("downloading", download, "remote", remote, "to", tmpf)

	return &Transfer{
		Local:    tmpf,
		Remote:   remote,
		Download: download,
		Len:      len,
		Offset:   0,
	}
}
