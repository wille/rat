package main

import (
	"rat/shared/network/header"
)

type KeyPacket struct {
	KeyCode int
	State   int
}

func (packet KeyPacket) Header() header.PacketHeader {
	return header.KeyHeader
}

func (packet KeyPacket) Init(c *Client) {

}
