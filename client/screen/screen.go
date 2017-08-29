package screen

/*
#include "screen.h"
*/
import "C"
import "rat/common"

//export MonitorCallback
func MonitorCallback(cm C.Monitor) {
	monitor := common.Monitor{
		int(cm.id),
		int(cm.coordinates.x),
		int(cm.coordinates.y),
		int(cm.coordinates.width),
		int(cm.coordinates.height),
	}
	Monitors = append(Monitors, monitor)
}

func QueryMonitors() {
	Monitors = make([]common.Monitor, 0)
	C.QueryMonitors()
}
