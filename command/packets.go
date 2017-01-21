package main

import (
	"rat/common"
)

type PacketMap map[common.PacketHeader]IncomingPacket

var packets PacketMap

type OutgoingPacket interface {
	GetHeader() common.PacketHeader
	Write(c *Client) error
}

type IncomingPacket interface {
	Read(c *Client) error
}

func InitPackets() {
	packets = make(PacketMap)
	packets[common.PingHeader] = Ping{}
	packets[common.UsernameHeader] = Username{}
}

func GetIncomingPacket(header common.PacketHeader) IncomingPacket {
	return packets[header]
}
