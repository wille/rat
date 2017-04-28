package process

import (
	"io/ioutil"
	"strconv"
)

/*
#include "process.h"
*/
import "C"

func QueryProcesses() {
	Processes = make([]Process, 0)

	files, err := ioutil.ReadDir("/proc")

	if err != nil {
		panic(err)
	}

	for _, file := range files {
		if file.IsDir() {
			pid, err := strconv.Atoi(file.Name())

			if err == nil { // name is pid
				cmdline, err := ioutil.ReadFile("/proc/" + file.Name() + "/cmdline")

				if err != nil {
					cmdline = []byte("")
				}

				proc := Process{string(cmdline), pid}
				Processes = append(Processes, proc)
			}
		}
	}
}

func Kill(pid int) {
	C.Kill(C.int(pid))
}
