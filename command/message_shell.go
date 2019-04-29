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

	client.streamChan <- ShellChannel{}
	return nil
}
