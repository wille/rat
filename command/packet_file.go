package main

import "rat/common"

type FilePacket struct {
	Task        common.FileTask
	Path        string
	Destination string
}

func (packet FilePacket) GetHeader() common.PacketHeader {
	return common.FileHeader
}

func (packet FilePacket) Write(c *Client) error {
	c.WriteString(packet.Path)
	c.WriteInt(int(packet.Task))

	if packet.Task == common.Copy || packet.Task == common.Move {
		c.WriteString(packet.Destination)
	}

	return nil
}

func (packet FilePacket) Read(c *Client) error {
	return nil
}
