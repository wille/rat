package main

import (
	"rat/shared/network/header"
	"reflect"
)

type PacketMap map[header.PacketHeader]reflect.Type

var packets PacketMap

func init() {
	packets = make(PacketMap)
	packets[header.PingHeader] = reflect.TypeOf(PingPacket{})
	packets[header.ScreenHeader] = reflect.TypeOf(RecvScreenPacket{})
	packets[header.DirectoryHeader] = reflect.TypeOf(DirectoryPacket{})
	packets[header.ProcessHeader] = reflect.TypeOf(ProcessPacket{})
	packets[header.MouseHeader] = reflect.TypeOf(MousePacket{})
	packets[header.MouseMoveHeader] = reflect.TypeOf(MouseMovePacket{})
	packets[header.KeyHeader] = reflect.TypeOf(KeyPacket{})
	packets[header.DownloadToServerHeader] = reflect.TypeOf(UploadPacket{})
	packets[header.UploadToClientHeader] = reflect.TypeOf(DownloadPacket{})

	/*
		packets[header.SysHeader] = SysPacket{}
		packets[header.FileHeader] = FilePacket{}
		packets[header.ShellHeader] = ShellPacket{}
		packets[header.WindowsHeader] = WindowsPacket{}
	*/
}

func GetIncomingPacket(header header.PacketHeader) IncomingPacket {
	val := packets[header]
	return reflect.New(val).Elem().Interface().(IncomingPacket)
}
