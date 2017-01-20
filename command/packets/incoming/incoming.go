package incoming

import (
	"rat/common"
	"rat/command/client"
)

type PacketMap map[common.PacketHeader]Packet

var packets PacketMap

type Packet interface {
	Read(c *client.Client) error
}

func Init() {
	packets = make(PacketMap)
	packets[common.PingHeader] = Ping{}
	packets[common.UsernameHeader] = Username{}
}

func GetPacket(header common.PacketHeader) Packet {
	return packets[header]
}
