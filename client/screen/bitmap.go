package screen

import (
	"image"
)

func imageFromBitmap(buf []byte, width, height int) image.Image {
	return &image.RGBA{
		Pix:    buf,
		Stride: width * 4,
		Rect:   image.Rect(0, 0, width, height),
	}
}
