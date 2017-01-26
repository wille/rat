package main

import (
	"errors"
	"io"
	"rat/common"
)

type ScreenPacket struct {
	Activate bool
}

func (packet ScreenPacket) GetHeader() common.PacketHeader {
	return common.ScreenHeader
}

func (packet ScreenPacket) Write(c *Client) error {
	return c.WriteBool(packet.Activate)
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
