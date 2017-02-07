package main

import "rat/common"

type KeyPacket struct {
	Button int
	Event  int
}

func (packet KeyPacket) GetHeader() common.PacketHeader {
	return common.KeyHeader
}

func (packet KeyPacket) Write(c *Client) error {
	c.WriteInt(packet.Button)
	return c.WriteInt(packet.Event)
}

func (packet KeyPacket) Read(c *Client) error {
	return nil
}
