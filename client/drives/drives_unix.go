//+build !windows

package drives

import (
	"os"
)

func QueryDrives() {
	Drives = make([]os.FileInfo, 1)
	Drives[0] = DriveInfo{"/"}
}
