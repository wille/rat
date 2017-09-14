package main

import (
	"golang.org/x/net/websocket"
)

type MouseMoveMessage struct {
	X       float32 `json:"x"`
	Y       float32 `json:"y"`
	Monitor int     `json:"id"`
}

func (m MouseMoveMessage) Handle(ws *websocket.Conn, client *Client) error {
	client.Queue <- &MouseMovePacket{m.Monitor, int(m.X), int(m.Y)}

	return nil
}
