//+build darwin

package screen

/*
#cgo LDFLAGS: -framework Foundation -framework ApplicationServices -framework AppKit

#include <stdlib.h>
#include "screen.h"
#include "screen_macos.h"
*/
import "C"

import (
	"image"
	"rat/internal"
	"unsafe"
	"fmt"
)

func CaptureWindow(handle int) image.Image {
	cap := C.CaptureWindow(C.int(handle))
	fmt.Println("Handled capture", cap.width, cap.height)
	
	defer C.Release()

	return handleCapture(cap)
}

func Capture(monitor shared.Monitor) image.Image {
	m := cMonitor(monitor)

	cap := C.CaptureMonitor(m)

	defer C.Release()

	return handleCapture(cap)
}

func handleCapture(cap C.Capture) image.Image {
	width := int(cap.width)
	height := int(cap.height)

	image := cap.data

	length := width * height * 4
	buf := C.GoBytes(unsafe.Pointer(image), C.int(length))
	fmt.Println("len", width * height * 4, len(buf))
	C.Release();

	return imageFromBitmap(buf, width, height)
}
