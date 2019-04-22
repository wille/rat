package main

import (
	"io"
	"rat/shared/network/header"
)

type Incoming interface {
	Read(io.ReadWriter, *Connection) error
}

type Channel interface {
	Open(io.ReadWriteCloser, *Connection)
}

type handlerMapT map[header.PacketHeader]interface{}

var handlerMap handlerMapT

func init() {
	handlerMap = make(handlerMapT)
	handlerMap[header.PingHeader] = PingPacket{}

	handlerMap[header.ChannelImplHeader] = ChannelImpl{}
}
