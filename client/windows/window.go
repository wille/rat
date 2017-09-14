package windows

/*
#include "window.h"
*/
import "C"

import (
	"rat/shared"
)

// Windows array, will be populated after call to QueryWindows()
var Windows []shared.Window

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
	}

	Windows = append(Windows, window)
}

func QueryWindows() {
	Windows = make([]shared.Window, 1)

	C.QueryWindows()
}

func SetDisplayState(handle int, visible bool) {
	C.SetDisplayState(C.int(handle), C.bool(visible))
}
