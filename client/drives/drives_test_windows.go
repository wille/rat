package drives

import (
	"fmt"
	"testing"

	"github.com/wille/osutil"
)

func TestDrives(t *testing.T) {
	if osutil.Name != osutil.Windows {
		t.Fail()
		return
	}

	QueryDrives()

	for _, drive := range Drives {
		fmt.Println(drive.Name())
	}
}
