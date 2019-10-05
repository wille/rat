package imgdiff

import (
	"image"
	"image/color"
	"testing"
)

func TestDiff(t *testing.T) {
	const (
		c = 2
		r = 2
		w = 4
		h = 4
	)

	rgba := image.NewRGBA(image.Rectangle{
		Max: image.Point{w, h},
	})

	for i := range rgba.Pix {
		rgba.Pix[i] = 255
	}

	cmp := NewComparer(c, r)
	go cmp.Update(rgba)
	// initial image, all chunks are updated
	for i := 0; i < c*r; i++ {
		<-cmp.C
	}

	// set 0x0
	rgba.Set(0, 0, color.RGBA{1, 2, 3, 4})
	go cmp.Update(rgba)
	<-cmp.C
	// detect change
	if cmp.xor.Pix[cmp.xor.PixOffset(0, 0)] == 0 {
		t.Fatal("xor does not contain change at 0x0")
	}

	rgba.Set(2, 2, color.RGBA{1, 255, 0, 255})
	go cmp.Update(rgba)
	<-cmp.C
	if cmp.xor.Pix[cmp.xor.PixOffset(2, 2)] == 0 {
		t.Fatal("xor does not contain change at 2x2")
	}
}
