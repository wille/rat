package imgdiff

import (
	"image"
	"image/color"
	"image/png"
	"os"
	"testing"
)

func TestDiff(t *testing.T) {
	file, _ := os.Open("bitmap.png")
	defer file.Close()
	png, err := png.Decode(file)
	if err != nil {
		t.Fatal(err)
	}

	rgba := png.(*image.RGBA)
	c := NewComparer(2, 2, 16, 16)
	c.diff(rgba)

	rgba.Set(8, 0, color.RGBA{255, 0, 0, 255})
	c.diff(rgba)

	rgba.Set(8, 0, color.RGBA{255, 255, 255, 255})

	c.diff(rgba)
}
