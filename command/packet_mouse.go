package main

import "rat/shared"

type MousePacket struct {
	Monitor int `network:"send"`
	Button  int `network:"send"`
	Event   int `network:"send"`
}

func (packet MousePacket) Header() shared.PacketHeader {
	return shared.MouseHeader
}

func (packet MousePacket) Init(c *Client) {

}
