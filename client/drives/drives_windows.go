package drives

import "os"

/*
#include "drives.h"
*/
import "C"
import "strings"

//export Callback
func Callback(c C.char) {
	Drives = append(Drives, DriveInfo{strings.ToUpper(string(c)) + ":"})
}

func QueryDrives() {
	Drives = make([]os.FileInfo, 0)

	C.QueryDrives()
}
