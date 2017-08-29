package main

import (
	"rat/common"
)

type ScreenPacket struct {
	Activate bool    `send`
	Scale    float32 `send`
	Monitor  int     `send`

	Buffer []byte `receive`
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
