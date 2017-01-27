package process

/*
#include <stdlib.h>
#include "process.h"
*/
import "C"

type Process struct {
	Path string
	PID  int
}

var (
	Processes []Process
)

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
