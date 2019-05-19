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
	for _, monitor := range Monitors {
		fmt.Println("Capturing monitor", monitor.ID)
		img := Capture(monitor)

		file, err := os.Create("test" + strconv.Itoa(monitor.ID) + ".jpg")

		if err != nil {
			t.Fatal(err)
		}
		jpeg.Encode(file, img, &jpeg.Options{
			Quality: 75,
		})
		file.Close()
	}
}

func TestWindows(t *testing.T) {
	windows.QueryWindows()

	for _, window := range windows.Windows {
		img := CaptureWindow(window.Handle)

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
}
