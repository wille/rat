package main

import (
	"rat/shared/network/header"
)

type KeyPacket struct {
	Button int `network:"send"`
	Event  int `network:"send"`
}

func (packet KeyPacket) Header() header.PacketHeader {
	return header.KeyHeader
}

func (packet KeyPacket) Init(c *Client) {

}
