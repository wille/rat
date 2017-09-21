package windows

import (
	"fmt"
	"image"
	"image/png"
	"os"
	"rat/shared"
	"strconv"
	"testing"
)

func handleImage(icon shared.Icon) image.Image {
	return &image.RGBA{
		Pix:    icon.Data,
		Stride: icon.Width * 4,
		Rect:   image.Rect(0, 0, icon.Width, icon.Height),
	}
}

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

			if w.HasIcon() {
				file, _ := os.Create("icon" + strconv.Itoa(w.Handle) + ".png")
				png.Encode(file, handleImage(w.Icon))
				file.Close()
			}

			w.Icon.Data = nil
			fmt.Println(w)
		}
	}

	if !foundTitle {
		t.Error("no window was found with a title")
	}
}
