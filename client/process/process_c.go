//+build windows darwin

package process

/*
#include <stdlib.h>
#include "process.h"
*/
import "C"

//export ProcessCallback
func ProcessCallback(p C.Process) {
	process := Process{
		Path: C.GoString(p.path),
		PID:  int(p.pid),
	}

	Processes = append(Processes, process)
}

func QueryProcesses() {
	Processes = make([]Process, 0)
	C.QueryProcesses()
}

func Kill(pid int) {
	C.Kill(C.int(pid))
}