package screen

/*
#include "screen.h"
*/
import "C"

type Monitor struct {
	ID     int `json:"id"`
	X      int `json:"x"`
	Y      int `json:"y"`
	Width  int `json:"width"`
	Height int `json:"height"`
}

var (
	Monitors []Monitor
)

func init() {
	Monitors = make([]Monitor, 0)
}

func cMonitor(monitor Monitor) C.Monitor {
	var m C.Monitor

	m.id = C.int(monitor.ID)
	m.coordinates.x = C.int(monitor.X)
	m.coordinates.y = C.int(monitor.Y)
	m.coordinates.width = C.int(monitor.Width)
	m.coordinates.height = C.int(monitor.Height)

	return m
}
