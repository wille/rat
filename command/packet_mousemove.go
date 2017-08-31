package main

import "rat/shared"

type MouseMovePacket struct {
	Monitor int `network:"send"`
	X       int `network:"send"`
	Y       int `network:"send"`
}

func (packet MouseMovePacket) Header() shared.PacketHeader {
	return shared.MouseMoveHeader
}

func (packet MouseMovePacket) Init(c *Client) {

}
