package main

import "rat/common"

type MousePacket struct {
	Monitor int `send`
	Button  int `send`
	Event   int `send`
}

func (packet *MousePacket) Header() common.PacketHeader {
	return common.MouseHeader
}

func (packet *MousePacket) Init(c *Client) {

}
