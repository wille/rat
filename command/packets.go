package main

import (
	"rat/internal/network/header"
)

type incomingPacketMapT map[header.PacketHeader]Incoming

var incomingPackets incomingPacketMapT

type Packet struct{}

func init() {
	incomingPackets = make(incomingPacketMapT)
	incomingPackets[header.PingHeader] = Ping{}
	incomingPackets[header.ComputerInfoHeader] = ComputerInfoPacket{}
	/* 	packets[header.ScreenHeader] = reflect.TypeOf(ScreenPacket{})
	   	packets[header.ProcessHeader] = reflect.TypeOf(ProcessPacket{})
	   	packets[header.DirectoryHeader] = reflect.TypeOf(DirectoryPacket{})
	   	packets[header.UploadToClientHeader] = reflect.TypeOf(UploadPacket{})
	   	packets[header.DownloadToServerHeader] = reflect.TypeOf(DownloadPacket{})
	   	packets[header.ShellHeader] = reflect.TypeOf(ShellPacket{})
	   	packets[header.WindowsHeader] = reflect.TypeOf(WindowsPacket{}) */
}
