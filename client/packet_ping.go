package main

import (
	"rat/client/network/header"

	"gopkg.in/mgo.v2/bson"
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

func (packet PingPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
