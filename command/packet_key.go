package main

import "rat/common"

type KeyPacket struct {
	Button int `send`
	Event  int `send`
}

func (packet KeyPacket) Header() common.PacketHeader {
	return common.KeyHeader
}

func (packet KeyPacket) Init(c *Client) {

}
