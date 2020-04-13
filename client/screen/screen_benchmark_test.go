package screen

import (
	"testing"
)

func BenchmarkScreenshot(b *testing.B) {
	monitor := Monitors[0]

	sc := ScreenCapture{}
	sc.Start()

	for i := 0; i < b.N; i++ {
		sc.CaptureMonitor(monitor)
	}

	sc.Destroy()
}
