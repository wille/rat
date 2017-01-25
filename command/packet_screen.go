package main

import (
	"errors"
	"io"
)

type ScreenPacket struct {
	IncomingPacket
}

func (packet ScreenPacket) Read(c *Client) error {
	len, err := c.ReadInt()

	if err != nil {
		return err
	}

	c.Screen.Buffer = make([]byte, int(len))

	rlen, err := io.ReadFull(c, c.Screen.Buffer)

	if int32(rlen) != len {
		return errors.New("EOF")
	}

	if err != nil {
		return err
	}

	return nil
}
