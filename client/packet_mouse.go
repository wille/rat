package main

import "rat/common"
import "rat/client/screen"

type MousePacket struct {
}

func (packet MousePacket) GetHeader() common.PacketHeader {
	return common.MouseHeader
}

func (packet MousePacket) Write(c *Connection) error {
	return nil
}

func (packet MousePacket) Read(c *Connection) error {
	monitorID, _ := c.ReadInt()
	button, _ := c.ReadInt()
	ttype, _ := c.ReadInt()

	screen.Mouse(monitorID, button, ttype)

	return nil
}
