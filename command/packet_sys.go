package main

import (
	"rat/common"
	"rat/common/system"
)

type SysPacket struct {
	action system.Action
}

func (packet SysPacket) GetHeader() common.PacketHeader {
	return common.SysHeader
}

func (packet SysPacket) Write(c *Client) error {
	return c.WriteInt(int(packet.action))
}
