package outgoing

import (
	"rat/common"
	"rat/command/networking"
)

type Packet interface {
	GetHeader() common.PacketHeader
	Write(c *networking.Client) error
}
