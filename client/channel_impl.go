package main

import (
	"fmt"
	"io"
)

type ChannelImpl struct{}

func (ChannelImpl) Open(r io.ReadWriteCloser, c *Connection) {
	defer r.Close()

	for {
		b := make([]byte, 4)
		n, err := r.Read(b)

		fmt.Println("read stream", b, n, err)
		if err != nil {
			break
		}
	}
}
