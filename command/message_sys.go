package main

import (
	"encoding/json"

	"time"

	"golang.org/x/net/websocket"
)

type SysAction int

const (
	Disconnect SysAction = iota
	Shutdown
	Reboot
)

type SysMessage Message

func (sys SysMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	var action int

	err := json.Unmarshal([]byte(data), &action)
	if err != nil {
		return err
	}

	client.Queue <- SysPacket{SysAction(action)}

	if action == int(Disconnect) {
		go func() {
			time.Sleep(time.Second)
			client.Conn.Close()
		}()
	}

	return nil
}
