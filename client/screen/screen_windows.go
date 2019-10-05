package screen

/*
#cgo LDFLAGS: -lGdi32 -lgdiplus
#include <windows.h>
#include "screen.h"
#include "screen_windows.h"
*/
import "C"

import (
	"image"
	"rat/internal"
	"unsafe"
)

func Capture(monitor shared.Monitor) image.Image {
	m := cMonitor(monitor)

	cap := C.CaptureMonitor(m)
	defer C.Release(cap)

	return handleCapture(cap)
}

func CaptureWindow(handle int) image.Image {
	cap := C.CaptureWindow(C.int(handle))
	defer C.Release(cap)

	return handleCapture(cap)
}

func handleCapture(data C.Capture) image.Image {
	width := int(data.width)
	height := int(data.height)
	size := width * height * 4

	buf := C.GoBytes(unsafe.Pointer(data.data), C.int(size))

	return imageFromBitmap(buf, width, height)
}
