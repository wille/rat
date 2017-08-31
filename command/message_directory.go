package main

import (
	"encoding/json"
	"rat/shared"

	"golang.org/x/net/websocket"
)

type DirectoryRequestEvent struct {
	Path string `json:"path"`
}

type DirectoryRequestMessage Message

func (d DirectoryRequestMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	var directoryEvent DirectoryRequestEvent
	err := json.Unmarshal([]byte(data), &directoryEvent)
	if err != nil {
		return err
	}

	client.Listeners[shared.DirectoryHeader] = ws
	client.Queue <- &DirectoryPacket{Path: directoryEvent.Path}

	return nil
}
