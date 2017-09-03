package main

import (
	"golang.org/x/net/websocket"
)

type KeyMessage struct {
	Key   int `json:"keyCode"`
	Event int `json:"state"`
}

func (m KeyMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	client.Queue <- &KeyPacket{m.Key, m.Event}

	return nil
}
