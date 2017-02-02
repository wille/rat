package drives

import (
	"fmt"
	"oslib"
	"testing"
)

func TestDrives(t *testing.T) {
	if oslib.Name != oslib.Windows {
		t.Error("Test should only run on Windows")
		return
	}

	QueryDrives()

	for _, drive := range Drives {
		fmt.Println(drive.Name())
	}
}
