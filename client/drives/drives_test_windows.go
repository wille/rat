package drives

import (
	"fmt"
	"rat/client/os"
	"testing"
)

func TestDrives(t *testing.T) {
	if oslib.Name != oslib.Windows {
		t.Fail()
		return
	}

	QueryDrives()

	for _, drive := range Drives {
		fmt.Println(drive.Name())
	}
}
