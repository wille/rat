package main

import (
	"golang.org/x/net/websocket"
)

type KeyMessage struct {
	KeyCode int
	State   int
}

func (m KeyMessage) Handle(ws *websocket.Conn, client *Client) error {
	client.Queue <- &KeyPacket{m.KeyCode, m.State}

	return nil
}
