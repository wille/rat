package screen

/*
#cgo LDFLAGS: -lGdi32 -lgdiplus
#include <windows.h>
#include "screen.h"
*/
import "C"

import (
	"bytes"
	"fmt"
	"image"
	"unsafe"

	"golang.org/x/image/bmp"
)

func Capture(monitor Monitor) image.Image {
	var m C.Monitor

	m.id = C.int(monitor.ID)
	m.coordinates.x = C.int(monitor.X)
	m.coordinates.y = C.int(monitor.Y)
	m.coordinates.width = C.int(monitor.Width)
	m.coordinates.height = C.int(monitor.Height)

	var len C.int

	buf := C.GetScreenshot(m, &len)

	buf1 := C.GoBytes(unsafe.Pointer(buf), len)

	img, err := bmp.Decode(bytes.NewReader(buf1))

	C.free(unsafe.Pointer(buf))

	if err != nil {
		fmt.Println(err.Error())
		return nil
	}

	return img
}
