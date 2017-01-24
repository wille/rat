//+build !windows,!darwin

package screen

/*
#cgo LDFLAGS: -lX11
#include <stdlib.h>
#include "screen.h"
*/
import "C"

import (
	"bytes"
	"fmt"
	"image"
	"unsafe"

	"github.com/disintegration/imaging"
	"golang.org/x/image/bmp"
)

func Capture(monitor Monitor) image.Image {
	var m C.Monitor

	m.id = C.int(monitor.id)
	m.coordinates.x = C.int(monitor.x)
	m.coordinates.y = C.int(monitor.y)
	m.coordinates.width = C.int(monitor.width)
	m.coordinates.height = C.int(monitor.height)

	var len C.int

	buf := C.GetScreenshot(m, &len)

	buf1 := C.GoBytes(unsafe.Pointer(buf), len)

	img, err := bmp.Decode(bytes.NewReader(buf1))

	C.free(unsafe.Pointer(buf))

	if err != nil {
		fmt.Println(err.Error())
		return nil
	}

	rotated := imaging.Rotate180(img)
	rotated = imaging.FlipH(rotated)

	return rotated
}
