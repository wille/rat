//+build darwin

package screen

/*
#cgo LDFLAGS: -framework ApplicationServices

#include <stdlib.h>
#include "screen.h"
#include "bitmap.h"
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

// Offset where the bitmap data begins (after file and info header)
var dataOffset int

func init() {
	dataOffset = int(C.sizeof_BITMAPFILEHEADER) + int(C.sizeof_BITMAPINFOHEADER)
}

func Capture(monitor Monitor) image.Image {
	m := cMonitor(monitor)

	var len C.int

	buf := C.GetScreenshot(m, &len)
	buf1 := C.GoBytes(unsafe.Pointer(buf), len)

	for i := dataOffset; i < int(len); i += 4 {
		r := buf1[i]
		b := buf1[i+2]

		temp := r

		buf1[i] = b
		buf1[i+2] = temp
	}

	img, err := bmp.Decode(bytes.NewReader(buf1))

	C.free(unsafe.Pointer(buf))

	if err != nil {
		fmt.Println("error decoding bitmap:", err.Error())
		return nil
	}

	rotated := imaging.Rotate180(img)
	rotated = imaging.FlipH(rotated)

	return rotated
}
