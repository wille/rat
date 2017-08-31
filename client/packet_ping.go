package main

import (
	"rat/shared/network/header"
)

type PingPacket struct {
}

func (packet PingPacket) Header() header.PacketHeader {
	return header.PingHeader
}

func (packet *PingPacket) Init() {

}

func (packet PingPacket) OnReceive() error {
	Queue <- &PingPacket{}
	return nil
}
