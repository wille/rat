//+build !x11,!windows,!darwin

package screen

import (
	"image"
	"math/rand"
	"rat/shared"
)

var cursor int

func mockImage(w, h int) *image.RGBA {
	img := image.NewRGBA(image.Rectangle{
		Min: image.Point{0, 0},
		Max: image.Point{w, h},
	})

	color := []uint8{
		uint8(rand.Int31n(255)),
		uint8(rand.Int31n(255)),
		uint8(rand.Int31n(255)),
		255,
	}

	for i := 0; i < w*h; i++ {
		copy(img.Pix[i*4:], color)
	}

	return img
}

func CaptureWindow(handle int) image.Image {
	return nil
}

func Capture(monitor shared.Monitor) image.Image {
	return mockImage(monitor.Width, monitor.Height)
}
