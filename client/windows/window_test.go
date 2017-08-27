package windows

import (
	"fmt"
	"testing"
)

func TestQuery(t *testing.T) {
	QueryWindows()

	fmt.Println("Found", len(Windows), "windows")
}
