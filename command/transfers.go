package main

import (
	"fmt"
	"io/ioutil"
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

func NewDownload(remote string, len int64) *Transfer {
	dir, _ := ioutil.TempDir("", "downloads")
	tmpf := filepath.Join(dir, filepath.Base(remote))

	fmt.Println("downloading", remote, "to", tmpf)

	return &Transfer{
		Local:    tmpf,
		Remote:   remote,
		Download: true,
		Len:      len,
		Offset:   0,
	}
}
