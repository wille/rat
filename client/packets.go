package main

import (
	"rat/network2"
	"rat/shared/network/header"
)

type PacketMap map[header.PacketHeader]interface{}

var packets PacketMap

func init() {
	packets = make(PacketMap)
	packets[header.PingHeader] = PingPacket{}
	packets[header.ChannelImplHeader] = ChannelImpl{}
	/* packets[header.ScreenHeader] = reflect.TypeOf(RecvScreenPacket{})
	packets[header.DirectoryHeader] = reflect.TypeOf(DirectoryPacket{})
	packets[header.ProcessHeader] = reflect.TypeOf(ProcessPacket{})
	packets[header.MouseHeader] = reflect.TypeOf(MousePacket{})
	packets[header.MouseMoveHeader] = reflect.TypeOf(MouseMovePacket{})
	packets[header.KeyHeader] = reflect.TypeOf(KeyPacket{})
	packets[header.DownloadToServerHeader] = reflect.TypeOf(UploadPacket{})
	packets[header.UploadToClientHeader] = reflect.TypeOf(DownloadPacket{}) */

	/*
		packets[header.SysHeader] = SysPacket{}
		packets[header.FileHeader] = FilePacket{}
		packets[header.ShellHeader] = ShellPacket{}
		packets[header.WindowsHeader] = WindowsPacket{}
	*/
}

func GetIncomingPacket(header header.PacketHeader) network2.Incoming {
	return packets[header].(network2.Incoming)
}

func GetIncomingChannel(header header.PacketHeader) Channel {
	return packets[header].(Channel)
}
