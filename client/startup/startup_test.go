package startup

import (
	"fmt"
	"os"
	"testing"
)

func TestStartup(t *testing.T) {
	executable := os.Args[0]

	fmt.Println("Executable:", executable)

	Install("name", executable)
}
