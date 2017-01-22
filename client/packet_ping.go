package main

import "rat/common"

type Ping struct {
	IncomingPacket
	OutgoingPacket
}

func (packet Ping) GetHeader() common.PacketHeader {
	return common.PingHeader
}

func (packet Ping) Write(c *Connection) error {
	return nil
}

func (packet Ping) Read(c *Connection) error {
	c.WritePacket(Ping{})
	return nil
}
