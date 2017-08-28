package network

import "rat/common"

// Packet
type Packet interface {
}

type IncomingPacket interface {
	OnReceive() error
}

type OutgoingPacket interface {
	Init()
	Header() common.PacketHeader
}
