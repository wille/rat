package main

import (
	"rat/client/network/header"
	"reflect"
)

type PacketMap map[header.PacketHeader]reflect.Type

var packets PacketMap

func init() {
	packets = make(PacketMap)
	packets[header.PingHeader] = reflect.TypeOf(PingPacket{})
	packets[header.ScreenHeader] = reflect.TypeOf(RecvScreenPacket{})

	/*
		packets[header.SysHeader] = SysPacket{}
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
	*/
}

func GetIncomingPacket(header header.PacketHeader) IncomingPacket {
	val := packets[header]
	return reflect.New(val).Elem().Interface().(IncomingPacket)
}
