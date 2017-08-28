package network

import "rat/common"

// Packet
type Packet interface {
	Header() common.PacketHeader
}

type IncomingPacket interface {
	OnRecieve() error
}

type OutgoingPacket interface {
	Init()
}
