package imgdiff

import (
	"image"
	"math/rand"
	"testing"
)

const (
	w = 1920
	h = 1080
)

// BenchmarkDiff compares images with every chunk changed
func BenchmarkEncoding(b *testing.B) {
	r := image.Rect(0, 0, w, h)
	img0 := image.NewRGBA(r)

	for i := range img0.Pix {
		img0.Pix[i] = 255
	}

	cmp := NewComparer()

	for n := 0; n < b.N; n++ {
		rnd := uint8(rand.Int31n(255))
		for i := range img0.Pix {
			img0.Pix[i] = rnd
		}
		cmp.Encode(img0)
	}
}

func BenchmarkDecoding(b *testing.B) {
	r := image.Rect(0, 0, w, h)
	img0 := image.NewRGBA(r)

	for i := range img0.Pix {
		img0.Pix[i] = 255
	}

	cmp := NewComparer()

	for n := 0; n < b.N; n++ {
		rnd := uint8(rand.Int31n(255))
		for i := range img0.Pix {
			img0.Pix[i] = rnd
		}
		cmp.Decode(img0)
	}
}
