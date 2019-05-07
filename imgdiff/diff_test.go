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
		w = 16
		h = 16
	)

	rgba := image.NewRGBA(image.Rectangle{
		Min: image.Point{0, 0},
		Max: image.Point{w, h},
	})

	cmp := NewComparer(c, r, w, h)
	go cmp.Run(rgba)
	// initial image, all chunks are updated
	for i := 0; i < c*r; i++ {
		<-cmp.C
	}

	rgba.Set(0, 0, color.RGBA{255, 0, 0, 255})
	go cmp.Run(rgba)
	change := <-cmp.C
	if change.Bounds.Min.X != 0 && change.Bounds.Min.Y != 0 {
		t.Fatal("did not detect first chunk change")
	}

	rgba.Set(8, 8, color.RGBA{0, 255, 0, 255})
	go cmp.Run(rgba)
	change = <-cmp.C
	if change.Bounds.Min.X != 8 && change.Bounds.Min.Y != 8 {
		t.Fatal("did not detect second chunk change")
	}
}
