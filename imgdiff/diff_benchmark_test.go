package imgdiff

import (
	"image"
	"image/jpeg"
	"io/ioutil"
	"math/rand"
	"testing"
)

// BenchmarkDiff tests comparison algorithm
func BenchmarkDiff(b *testing.B) {
	const (
		c = 6
		r = 6
		w = 1920
		h = 1080
	)

	rgba := image.NewRGBA(image.Rectangle{
		Min: image.Point{0, 0},
		Max: image.Point{w, h},
	})
	rand.Read(rgba.Pix)

	for i := 0; i < b.N; i++ {
		cmp := NewComparer(c, r, w, h)
		go cmp.Run(rgba)

		for j := 0; j < c*r; j++ {
			<-cmp.C
		}
	}
}

// BenchmarkEncoding tests for comparing and encoding chunks
func BenchmarkEncoding(b *testing.B) {
	const (
		c = 6
		r = 6
		w = 1920
		h = 1080
	)
	rgba := image.NewRGBA(image.Rectangle{
		Min: image.Point{0, 0},
		Max: image.Point{w, h},
	})
	rand.Read(rgba.Pix)

	for i := 0; i < b.N; i++ {
		cmp := NewComparer(c, r, w, h)
		go cmp.Run(rgba)

		for j := 0; j < c*r; j++ {
			jpeg.Encode(ioutil.Discard, <-cmp.C, nil)
		}
	}
}
