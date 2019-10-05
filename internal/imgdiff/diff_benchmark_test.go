package imgdiff

import (
	"image"
	"testing"
)

const (
	c = 6
	r = 6
	w = 1920
	h = 1080
)

// BenchmarkDiff compares images with every chunk changed
func BenchmarkDiff(b *testing.B) {
	img0 := image.NewRGBA(image.Rectangle{
		Max: image.Point{w, h},
	})
	img1 := image.NewRGBA(image.Rectangle{
		Max: image.Point{w, h},
	})

	for i := range img0.Pix {
		img0.Pix[i] = 255
	}

	cmp := NewComparer(c, r)

	for n := 0; n < b.N; n++ {
		go cmp.Update(img0)

		for j := 0; j < c*r; j++ {
			<-cmp.C
		}

		t := img0
		img0 = img1
		img1 = t
	}
}
