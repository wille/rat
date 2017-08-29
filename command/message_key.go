package main

import (
	"encoding/json"

	"golang.org/x/net/websocket"
)

type KeyEvent struct {
	Key   int `json:"keyCode"`
	Event int `json:"state"`
}

type KeyMessage Message

func (d KeyMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	var keyEvent KeyEvent
	err := json.Unmarshal([]byte(data), &keyEvent)
	if err != nil {
		return err
	}

	client.Queue <- &KeyPacket{keyEvent.Key, keyEvent.Event}

	return nil
}
