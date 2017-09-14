package main

import (
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

type DisplayTransferMessage struct {
	DisplayTransfers []DisplayTransfer `json:"transfers"`
}

var DisplayTransfers []DisplayTransfer

func (m DisplayTransferMessage) Handle(ws *websocket.Conn, client *Client) error {
	DisplayTransfers = m.DisplayTransfers
	return nil
}

func (m DisplayTransferMessage) Header() MessageHeader {
	return TransfersEvent
}
