package windows

import (
	"testing"
)

func TestQuery(t *testing.T) {
	QueryWindows()

	count := len(Windows)

	if count == 0 {
		t.Error("no windows found")
	}

	foundTitle := false
	for _, w := range Windows {
		if w.Title != "" {
			foundTitle = true
			break
		}
	}

	if !foundTitle {
		t.Error("no window was found with a title")
	}
}
