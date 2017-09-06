package screen

import (
	"fmt"
	"testing"
)

func TestQueryMonitors(t *testing.T) {
	QueryMonitors()

	for _, monitor := range Monitors {
		fmt.Println(monitor)
	}
}
