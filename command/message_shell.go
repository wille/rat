package main

import (
	"golang.org/x/net/websocket"
)

type ShellMessage struct {
	Action  int    `json:"action"`
	Command string `json:"command"`
}

func (m ShellMessage) Handle(ws *websocket.Conn, client *Client) error {
	//client.Listeners[header.ShellHeader] = ws
	//client.Queue <- &ShellPacket{m.Action, m.Command}

	switch m.Action {
	case 1:
	default:
		client.streamChan <- ShellChannel{ws}
	}

	return nil
}
