package screen

import (
	"testing"
)

func BenchmarkScreenshot(b *testing.B) {
	monitor := Monitors[0]

	for i := 0; i < b.N; i++ {
		Capture(monitor)
	}
}
