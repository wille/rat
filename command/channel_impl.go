package main

import (
	"fmt"
	"io"
	"rat/shared/network/header"
	"time"
)

type ChannelImpl struct{}

func (ChannelImpl) Header() header.PacketHeader {
	return header.ChannelImplHeader
}

func (ChannelImpl) Open(r io.ReadWriteCloser, c *Client) error {
	defer r.Close()

	ticker := time.NewTicker(1 * time.Second)
	timer := time.NewTimer(5 * time.Second)

	for {
		select {
		case <-ticker.C:
			_, err := r.Write([]byte("hello"))
			if err != nil {
				fmt.Println("stopped writing", err)
				break
			}
		case <-timer.C:
			ticker.Stop()
			timer.Stop()
		}
	}

	return nil
}
