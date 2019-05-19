package main

import (
	"rat/shared/network/header"
)

type MouseMovePacket struct {
	MonitorID int
	X         int
	Y         int
}

func (packet MouseMovePacket) Header() header.PacketHeader {
	return header.MouseMoveHeader
}

func (packet MouseMovePacket) Init(c *Client) {

}
