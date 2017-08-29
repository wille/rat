package main

import (
	"rat/common"
	"rat/common/system"
)

type SysPacket struct {
	Action system.Action `send`
}

func (packet *SysPacket) Header() common.PacketHeader {
	return common.SysHeader
}

func (packet *SysPacket) Init(c *Client) {

}
