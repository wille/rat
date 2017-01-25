package main

import "io"
import "errors"

type ScreenPacket struct {
	IncomingPacket
}

func (packet ScreenPacket) Read(c *Client) error {
	len, err := c.ReadInt()

	if err != nil {
		return err
	}

	c.Screen = make([]byte, int(len))

	rlen, err := io.ReadFull(c, c.Screen)

	if int32(rlen) != len {
		return errors.New("EOF")
	}

	if err != nil {
		return err
	}

	return nil
}
