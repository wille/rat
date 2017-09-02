package main

import (
	"golang.org/x/net/websocket"
)

type MouseMessage struct {
	Monitor int `json:"monitorId"`
	Button  int `json:"button"`
	Event   int `json:"state"`
}

func (m MouseMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	client.Queue <- &MousePacket{m.Monitor, m.Button, m.Event}

	return nil
}
