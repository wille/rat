package process

import (
	"fmt"
	"testing"
)

func TestQuery(t *testing.T) {
	QueryProcesses()

	for _, k := range Processes {
		fmt.Println(k.PID, k.Path)
	}
}
