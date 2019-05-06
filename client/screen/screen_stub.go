//+build !x11,!windows,!darwin

package screen

import (
	"C"
	"image"
	"rat/shared"
)

func CaptureWindow(handle int) image.Image {
	panic("CaptureWindow: not implemented")
}

func Capture(monitor shared.Monitor) image.Image {
	return &image.RGBA{}
}
