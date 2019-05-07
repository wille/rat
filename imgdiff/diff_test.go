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

	var offset int
	sums := make([]uint32, c*r)

	cmp := NewComparer(c, r, w, h)
	cmp.diff(rgba)
	copy(sums, cmp.Sums)

	rgba.Set(0, 0, color.RGBA{255, 0, 0, 255})
	cmp.diff(rgba)
	offset = cmp.ChunkOffset(0, 0)
	if sums[offset] == cmp.Sums[offset] {
		t.Fatal()
	}

	copy(sums, cmp.Sums)
	rgba.Set(8, 8, color.RGBA{255, 255, 255, 255})
	cmp.diff(rgba)
	offset = cmp.ChunkOffset(1, 1)
	if sums[offset] == cmp.Sums[offset] {
		t.Fatal()
	}
}
