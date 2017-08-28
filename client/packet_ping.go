package main

import "rat/common"

type PingPacket struct {
}

func (packet PingPacket) Header() common.PacketHeader {
	return common.PingHeader
}

func (packet PingPacket) Init() {

}

func (packet PingPacket) OnReceive() error {
	Queue <- PingPacket{}
	return nil
}
