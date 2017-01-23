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

//export MonitorCallback
func MonitorCallback(cm C.Monitor) {
	monitor := Monitor{
		int(cm.id),
		int(cm.coordinates.x),
		int(cm.coordinates.y),
		int(cm.coordinates.width),
		int(cm.coordinates.height),
	}
	Monitors = append(Monitors, monitor)
}

func QueryMonitors() {
	C.QueryMonitors()
}

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

	return img
}
