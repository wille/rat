package main

import "rat/common"

type MousePacket struct {
	Monitor int `network:"send"`
	Button  int `network:"send"`
	Event   int `network:"send"`
}

func (packet MousePacket) Header() common.PacketHeader {
	return common.MouseHeader
}

func (packet MousePacket) Init(c *Client) {

}
