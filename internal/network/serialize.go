package network

type tagType int

const (
	tag = "network"

	// unknown struct tag
	unknown tagType = iota

	// send struct tag for serializing
	// ignored if deserializing
	send

	// receive struct tag for deserializing
	// ignored if serializing
	receive
)
