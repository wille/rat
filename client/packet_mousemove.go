package main

import (
	"rat/client/network/header"
	"rat/client/screen"
)

type MouseMovePacket struct {
	MonitorID int "monitor"
	X         int
	Y         int
}

func (packet MouseMovePacket) Header() header.PacketHeader {
	return header.MouseMoveHeader
}

func (packet MouseMovePacket) OnReceive() error {
	screen.MoveCursor(packet.MonitorID, packet.X, packet.Y)

	return nil
}
