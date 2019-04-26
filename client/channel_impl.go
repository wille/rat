package main

import (
	"fmt"
	"io"
)

type ChannelImpl struct{}

func (ChannelImpl) Open(r io.ReadWriteCloser, c *Connection) error {
	defer r.Close()

	for {
		b := make([]byte, 4)
		n, err := r.Read(b)

		fmt.Println("read stream", b, n)
		if err != nil {
			break
		}
	}

	return nil
}
