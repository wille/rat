package main

import "rat/common"

type MouseMovePacket struct {
	Monitor int `network:"send"`
	X       int `network:"send"`
	Y       int `network:"send"`
}

func (packet MouseMovePacket) Header() common.PacketHeader {
	return common.MouseMoveHeader
}

func (packet MouseMovePacket) Init(c *Client) {

}
