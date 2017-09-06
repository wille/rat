package screen

import (
	"fmt"
	"image/jpeg"
	"io/ioutil"
	"os"
	"strconv"
	"testing"
)

func TestScreenshot(t *testing.T) {
	for _, monitor := range Monitors {
		fmt.Println("Capturing monitor", monitor.ID)
		img := Capture(monitor)

		file, err := os.Create("test" + strconv.Itoa(monitor.ID) + ".jpg")

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

func BenchmarkScreenshot(b *testing.B) {
	monitor := Monitors[0]

	img := Capture(monitor)

	jpeg.Encode(ioutil.Discard, img, &jpeg.Options{
		Quality: 75,
	})
}
