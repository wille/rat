package main

import (
	"os"

	"golang.org/x/net/websocket"
)

type ExitMessage struct {
}

func (d ExitMessage) Handle(ws *websocket.Conn, client *Client) error {
	os.Exit(0)
	return nil
}