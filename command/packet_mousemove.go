package main

import "rat/common"

type MouseMovePacket struct {
	Monitor int `send`
	X       int `send`
	Y       int `send`
}

func (packet *MouseMovePacket) Header() common.PacketHeader {
	return common.MouseMoveHeader
}

func (packet *MouseMovePacket) Init(c *Client) {

}
