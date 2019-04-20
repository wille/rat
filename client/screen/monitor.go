package screen

/*
#include "screen.h"
*/
import "C"

import (
	"rat/shared"
)

var (
	Monitors []shared.Monitor
)

func init() {
	Monitors = make([]shared.Monitor, 0)
}

func cMonitor(monitor shared.Monitor) C.Monitor {
	var m C.Monitor

	m.id = C.int(monitor.ID)
	m.coordinates.x = C.int(monitor.X)
	m.coordinates.y = C.int(monitor.Y)
	m.coordinates.width = C.int(monitor.Width)
	m.coordinates.height = C.int(monitor.Height)

	return m
}
