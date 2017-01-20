package common

import (
	"encoding/binary"
)

var (
	ByteOrder binary.ByteOrder = binary.LittleEndian
)

type (
	PacketHeader uint16
)
