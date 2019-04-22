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

func (packet *PingPacket) Init() {

}

func (packet PingPacket) Read(io.ReadWriteCloser) error {
	Queue <- &PingPacket{}
	fmt.Println("recv ping")
	return nil
}
