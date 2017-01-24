package screen

/*
#include "screen.h"
*/
import "C"

//export MonitorCallback
func MonitorCallback(cm C.Monitor) {
	monitor := Monitor{
		int(cm.id),
		int(cm.coordinates.x),
		int(cm.coordinates.y),
		int(cm.coordinates.width),
		int(cm.coordinates.height),
	}
	Monitors = append(Monitors, monitor)
}

func QueryMonitors() {
	C.QueryMonitors()
}
