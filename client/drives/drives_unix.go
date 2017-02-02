//+build !windows

package drives

func QueryDrives() {
	Drives = make([]DriveInfo, 1)
	Drives[0] = DriveInfo{"/"}
}
