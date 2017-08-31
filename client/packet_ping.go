package main

import "rat/shared"

type PingPacket struct {
}

func (packet PingPacket) Header() shared.PacketHeader {
	return shared.PingHeader
}

func (packet *PingPacket) Init() {

}

func (packet PingPacket) OnReceive() error {
	Queue <- &PingPacket{}
	return nil
}
