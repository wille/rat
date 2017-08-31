package main

import (
	"rat/shared/network/header"
)

type MouseMovePacket struct {
	Monitor int `network:"send"`
	X       int `network:"send"`
	Y       int `network:"send"`
}

func (packet MouseMovePacket) Header() header.PacketHeader {
	return header.MouseMoveHeader
}

func (packet MouseMovePacket) Init(c *Client) {

}
