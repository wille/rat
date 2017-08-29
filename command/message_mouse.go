package main

import (
	"encoding/json"

	"golang.org/x/net/websocket"
)

type MouseEvent struct {
	Monitor int `json:"monitorId"`
	Button  int `json:"button"`
	Event   int `json:"state"`
}

type MouseMessage Message

func (d MouseMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	var mouseEvent MouseEvent
	err := json.Unmarshal([]byte(data), &mouseEvent)
	if err != nil {
		return err
	}

	client.Queue <- &MousePacket{mouseEvent.Monitor, mouseEvent.Button, mouseEvent.Event}

	return nil
}
