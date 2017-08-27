package windows

import (
	"fmt"
	"testing"
)

func TestQuery(t *testing.T) {
	QueryWindows()

	fmt.Println("Found", len(Windows), "windows")

	for i := 0; i < len(Windows); i++ {
		w := Windows[i]

		fmt.Println(w.Handle, w.Title, w.Rect)
	}
}
