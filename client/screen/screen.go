package screen

/*
#include "screen.h"
*/
import "C"
import (
	"image"
	shared "rat/internal"
)

type ScreenCapture interface {
	Start() error
	Destroy()
	CaptureMonitor(shared.Monitor) (*image.RGBA, error)
	CaptureWindow(handle int) (*image.RGBA, error)

	GetCursor() *Cursor
}

//export MonitorCallback
func MonitorCallback(cm C.Monitor) {
	monitor := shared.Monitor{
		int(cm.id),
		int(cm.coordinates.x),
		int(cm.coordinates.y),
		int(cm.coordinates.width),
		int(cm.coordinates.height),
	}
	Monitors = append(Monitors, monitor)
}

func QueryMonitors() {
	Monitors = make([]shared.Monitor, 0)
	C.QueryMonitors()
}
