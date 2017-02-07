package main

import "rat/common"
import "rat/client/screen"

type KeyPacket struct {
}

func (packet KeyPacket) GetHeader() common.PacketHeader {
	return common.KeyHeader
}

func (packet KeyPacket) Write(c *Connection) error {
	return nil
}

func (packet KeyPacket) Read(c *Connection) error {
	key, _ := c.ReadInt()
	ttype, _ := c.ReadInt()

	screen.Key(uint16(key), ttype)

	return nil
}
