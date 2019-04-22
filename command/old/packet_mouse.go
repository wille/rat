package main

import (
	"rat/shared/network/header"
)

type MousePacket struct {
	MonitorID int
	Button    int
	State     int
}

func (packet MousePacket) Header() header.PacketHeader {
	return header.MouseHeader
}

func (packet MousePacket) Init(c *Client) {

}
