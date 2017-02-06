package main

import (
	"encoding/json"

	"golang.org/x/net/websocket"
)

type DisplayTransfer struct {
	Remote   string  `json:"remote"`
	Local    string  `json:"local"`
	Progress float64 `json:"progress"`
	ID       float64 `json:"id"`
	Status   int     `json:"status"`
	Download bool    `json:"download"`
	Key      string  `json:"key,omitempty"`
}

type DisplayTransferEvent Message

var DisplayTransfers []DisplayTransfer

func (d DisplayTransferEvent) Handle(ws *websocket.Conn, client *Client, data string) error {
	err := json.Unmarshal([]byte(data), &DisplayTransfers)

	return err
}
