package screen

/*
#cgo LDFLAGS: -lGdi32 -lgdiplus
#include <windows.h>
#include "screen.h"
#include "screen_windows.h"
*/
import "C"

import (
	"fmt"
	"image"
	shared "rat/internal"
	"unsafe"
)

type WindowsScreenCapture struct {
	c_struct      *C.Capture
	lastCursorPtr C.HICON
}

func NewScreenCapture() ScreenCapture {
	return &WindowsScreenCapture{}
}

func (sc *WindowsScreenCapture) Start() error {
	sc.c_struct = C.init_capture()
	return nil
}

func (cp *WindowsScreenCapture) CaptureMonitor(monitor shared.Monitor) (*image.RGBA, error) {
	C.capture_monitor(cp.c_struct, C.int(monitor.X), C.int(monitor.Y), C.int(monitor.Width), C.int(monitor.Height))

	img := cp.c_struct.data

	len := monitor.Width * monitor.Height * 4
	buf := C.GoBytes(unsafe.Pointer(img), C.int(len))

	return &image.RGBA{
		Pix:    buf,
		Stride: int(monitor.Width) * 4,
		Rect:   image.Rect(0, 0, int(monitor.Width), int(monitor.Height)),
	}, nil
}

func (cp *WindowsScreenCapture) CaptureWindow(handle int) (*image.RGBA, error) {
	return nil, nil
}

func (cp *WindowsScreenCapture) Destroy() {

}

func (sc *WindowsScreenCapture) GetCursor() *Cursor {
	r := C.QueryCursor(sc.c_struct)
	fmt.Println(r)

	w := int(sc.c_struct.cursorWidth)
	h := int(sc.c_struct.cursorHeight)

	icon := &image.RGBA{
		Pix:    C.GoBytes(unsafe.Pointer(sc.c_struct.cursor_data), 24*24*4),
		Stride: w * 4,
		Rect:   image.Rect(0, 0, w, h),
	}

	return &Cursor{
		Icon:       icon,
		IconWidth:  w,
		IconHeight: h,
		X:          int(sc.c_struct.ci.ptScreenPos.x),
		Y:          int(sc.c_struct.ci.ptScreenPos.y),
		HotX:       int(sc.c_struct.cursorHotX),
		HotY:       int(sc.c_struct.cursorHotY),
	}
}
