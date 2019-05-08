//+build !x11,!windows,!darwin

package screen

import (
	"image"
	"rat/shared"
)

var cursor int

func mockImage(w, h int) *image.RGBA {
	img := image.NewRGBA(image.Rectangle{
		Min: image.Point{0, 0},
		Max: image.Point{w, h},
	})

	y := (h / 10) * cursor

	color := []uint8{255, 0, 0, 255}
	for ry := 0; ry < h/10; ry++ {
		offset := img.PixOffset(0, y+ry)

		for row := 0; row < w; row++ {
			copy(img.Pix[offset+row*4:], color)
		}
	}

	cursor++
	if cursor > 9 {
		cursor = 0
	}

	return img
}

func CaptureWindow(handle int) image.Image {
	panic("CaptureWindow: not implemented")
}

func Capture(monitor shared.Monitor) image.Image {
	return mockImage(monitor.Width, monitor.Height)
}
