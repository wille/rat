package main

import (
	"encoding/json"

	"golang.org/x/net/websocket"
)

type MouseMoveEvent struct {
	X       float32 `json:"x"`
	Y       float32 `json:"y"`
	Monitor int     `json:"id"`
}

type MouseMoveMessage Message

func (d MouseMoveMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	var mouseEvent MouseMoveEvent
	err := json.Unmarshal([]byte(data), &mouseEvent)
	if err != nil {
		return err
	}

	client.Queue <- &MouseMovePacket{mouseEvent.Monitor, int(mouseEvent.X), int(mouseEvent.Y)}

	return nil
}
