//+build !windows,!darwin

package screen

/*
#cgo LDFLAGS: -lX11
#include <stdlib.h>
#include "screen.h"
#include "screen_x11.h"
*/
import "C"

import (
	"image"
	"rat/shared"
	"unsafe"
)

func CaptureWindow(handle int) image.Image {
	image := C.CaptureWindow(C.int(handle))
	defer C.DestroyImage(image)

	return handleImage(image)
}

func Capture(monitor shared.Monitor) image.Image {
	m := cMonitor(monitor)

	image := C.CaptureMonitor(m)

	defer C.DestroyImage(image)

	return handleImage(image)
}

func handleImage(cap C.Capture) image.Image {
	width := int(cap.width)
	height := int(cap.height)

	len := width * height * 4
	buf := C.GoBytes(unsafe.Pointer(cap.image.data), C.int(len))

	return imageFromBitmap(buf, width, height)
}
