package main

import (
	"golang.org/x/net/websocket"
)

type MouseMoveMessage struct {
	MonitorID int
	X         int
	Y         int
}

func (m MouseMoveMessage) Handle(ws *websocket.Conn, client *Client) error {
	client.Queue <- &MouseMovePacket{m.MonitorID, m.X, m.Y}

	return nil
}
