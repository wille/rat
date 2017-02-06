package main

import (
	"rat/common"

	"golang.org/x/net/websocket"
)

type ProcessQueryMessage Message

func (d ProcessQueryMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	client.Listeners[common.ProcessHeader] = ws
	client.Queue <- ProcessPacket{}
	return nil
}
