package main

import (
	"golang.org/x/net/websocket"
)

type MouseMessage struct {
	MonitorID int
	Button    int
	State     int
}

func (m MouseMessage) Handle(ws *websocket.Conn, client *Client) error {
	client.Queue <- &MousePacket{m.MonitorID, m.Button, m.State}

	return nil
}
