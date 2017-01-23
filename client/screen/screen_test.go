package screen

import (
	"fmt"
	"image/jpeg"
	"os"
	"strconv"
	"testing"
)

func TestQueryMonitors(t *testing.T) {
	QueryMonitors()

	for _, monitor := range Monitors {
		fmt.Println(monitor)
	}
}

func TestScreenshot(t *testing.T) {
	for _, monitor := range Monitors {
		fmt.Println("Capturing monitor", monitor.id)
		img := Capture(monitor)

		file, err := os.Create("test" + strconv.Itoa(monitor.id) + ".jpg")

		if err != nil {
			fmt.Println("error", err.Error())
			continue
		}
		jpeg.Encode(file, img, &jpeg.Options{
			Quality: 75,
		})
		file.Close()
	}
}
