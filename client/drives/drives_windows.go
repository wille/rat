package drives

import "os"

/*
#include "drives.h"
*/
import "C"

//export Callback
func Callback(c C.char) {
	Drives = append(Drives, DriveInfo{string(c) + ":"})
}

func QueryDrives() {
	Drives = make([]os.FileInfo, 0)

	C.QueryDrives()
}
