//+build darwin

package screen

/*
#cgo LDFLAGS: -framework ApplicationServices

#include <stdlib.h>
#include "screen.h"
#include "screen_macos.h"
*/
import "C"

import (
	"image"
	"rat/shared"
	"unsafe"
)

func CaptureWindow(handle int) image.Image {
		return nil
}

func Capture(monitor shared.Monitor) image.Image {
	m := cMonitor(monitor)

	image := C.CaptureMonitor(m)

	len := monitor.Width * monitor.Height * 4
	buf := C.GoBytes(unsafe.Pointer(image), C.int(len))

	return imageFromBitmap(buf, monitor.Width, monitor.Height)
}
