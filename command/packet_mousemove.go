package main

import "rat/common"

type MouseMovePacket struct {
	Monitor, X, Y int
}

func (packet MouseMovePacket) GetHeader() common.PacketHeader {
	return common.MouseMoveHeader
}

func (packet MouseMovePacket) Write(c *Client) error {
	c.WriteInt(packet.Monitor)
	c.WriteInt(packet.X)
	return c.WriteInt(packet.Y)
}

func (packet MouseMovePacket) Read(c *Client) error {
	return nil
}
