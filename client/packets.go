package main

import (
	"rat/common"
)

type PacketMap map[common.PacketHeader]IncomingPacket

var packets PacketMap

type OutgoingPacket interface {
	GetHeader() common.PacketHeader
	Write(c *Connection) error
}

type IncomingPacket interface {
	Read(c *Connection) error
}

func init() {
	packets = make(PacketMap)
	packets[common.PingHeader] = Ping{}
	packets[common.ScreenHeader] = ScreenPacket{}
	packets[common.ProcessHeader] = ProcessPacket{}
	packets[common.DirectoryHeader] = DirectoryPacket{}
}

func GetIncomingPacket(header common.PacketHeader) IncomingPacket {
	return packets[header]
}
