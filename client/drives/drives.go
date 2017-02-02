package drives

import (
	"os"
	"time"
)

var Drives []os.FileInfo

type DriveInfo struct {
	Path string
}

func (d DriveInfo) Name() string {
	return d.Path
}

func (d DriveInfo) Size() int64 {
	return 0
}

func (d DriveInfo) Mode() os.FileMode {
	return 0
}

func (d DriveInfo) ModTime() time.Time {
	return time.Time{}
}

func (d DriveInfo) IsDir() bool {
	return true
}

func (d DriveInfo) Sys() interface{} {
	return nil
}
