package main

import "rat/shared"

type KeyPacket struct {
	Button int `network:"send"`
	Event  int `network:"send"`
}

func (packet KeyPacket) Header() shared.PacketHeader {
	return shared.KeyHeader
}

func (packet KeyPacket) Init(c *Client) {

}
