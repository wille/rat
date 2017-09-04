package startup

import (
	"os"
	"testing"
)

const (
	name = "test"
)

func TestStartup(t *testing.T) {
	executable := os.Args[0]

	err := Install(name, executable)
	if err != nil {
		t.Error("install failed: ", err)
	}

	if !Check(name) {
		t.Error("startup entry does not exist")
	}

	Uninstall(name)

	if Check(name) {
		t.Error("startup entry was not deleted")
	}
}
