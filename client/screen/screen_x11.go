//+build x11

package screen

/*
#cgo LDFLAGS: -lX11 -lXrandr -lXext -lXfixes
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/extensions/Xrandr.h>
#include "screen_x11.h"
*/
import "C"

import (
	"fmt"
	"image"
	shared "rat/internal"
	"unsafe"
)

type ScreenCapture struct {
	instance  *C.Capture
	cursorImg *image.RGBA
}

func NewScreenCapture() *ScreenCapture {
	return &ScreenCapture{}
}

func (cp *ScreenCapture) Start() error {
	cp.instance = C.init_capture()
	return nil
}

func (cp *ScreenCapture) Destroy() {
	C.destroy_capture(cp.instance)
}

func (cp *ScreenCapture) CaptureMonitor(monitor shared.Monitor) (*image.RGBA, error) {
	prev_cursor := cp.instance.cursor
	C.capture(cp.instance)

	if prev_cursor != cp.instance.cursor {
		fmt.Println("cursor has updated", cp.instance.cursor)
	}

	img := cp.instance.image

	len := img.width * img.height * 4
	buf := C.GoBytes(unsafe.Pointer(img.data), len)

	return &image.RGBA{
		Pix:    buf,
		Stride: int(img.width) * 4,
		Rect:   image.Rect(0, 0, int(img.width), int(img.height)),
	}, nil
}

// hasCursorChanged checks if the cursor icon has changed
// simce the last call
func (sc *ScreenCapture) hasCursorChanged() bool {
	prev_cursor := sc.instance.cursor
	C.query_cursor(sc.instance)
	return prev_cursor != sc.instance.cursor
}

func (sc *ScreenCapture) GetCursor() *Cursor {
	if sc.hasCursorChanged() {
		sc.cursorImg = sc.getCursorImage()
	}
	return &Cursor{
		Icon:       sc.cursorImg,
		IconWidth:  int(sc.instance.cursor.width),
		IconHeight: int(sc.instance.cursor.height),
		X:          int(sc.instance.cursor.x),
		Y:          int(sc.instance.cursor.y),
		HotX:       int(sc.instance.cursor.xhot),
		HotY:       int(sc.instance.cursor.yhot),
	}
}

func (sc *ScreenCapture) getCursorImage() *image.RGBA {
	w := sc.instance.cursor.width
	h := sc.instance.cursor.height

	pixels := int(w * h)

	// cursor pixels is stored in 64 bit longs but they only contain 32 bit pixel data
	src := C.GoBytes(unsafe.Pointer(sc.instance.cursor.pixels), C.int(pixels*8))
	src64 := *(*[]uint64)(unsafe.Pointer(&src))

	dst := make([]uint8, pixels*4)
	dst32 := *(*[]uint32)(unsafe.Pointer(&dst))

	for i := 0; i < int(pixels); i++ {
		dst32[i] = uint32(src64[i])
	}

	return &image.RGBA{
		Pix:    dst,
		Stride: int(sc.instance.cursor.width * 4),
		Rect:   image.Rect(0, 0, int(w), int(h)),
	}
}

func (sc *ScreenCapture) CaptureWindow(handle int) (*image.RGBA, error) {
	return nil, nil
}
