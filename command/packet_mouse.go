package main

import (
	"rat/shared/network/header"
)

type MousePacket struct {
	Monitor int `network:"send"`
	Button  int `network:"send"`
	Event   int `network:"send"`
}

func (packet MousePacket) Header() header.PacketHeader {
	return header.MouseHeader
}

func (packet MousePacket) Init(c *Client) {

}
