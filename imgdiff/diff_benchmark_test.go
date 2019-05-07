package imgdiff

import (
	"image"
	"image/color"
	"math/rand"
	"testing"
)

func randomColor() color.RGBA {
	return color.RGBA{
		R: uint8(rand.Int31n(255)),
		G: uint8(rand.Int31n(255)),
		B: uint8(rand.Int31n(255)),
		A: 255,
	}
}

func BenchmarkDiff(b *testing.B) {
	const (
		c = 2
		r = 2
		w = 16
		h = 16
	)

	cmp := NewComparer(c, r, w, h)

	run := true
	go func() {
		for run {
			<-cmp.C
		}
	}()

	for i := 0; i < b.N; i++ {
		rgba := image.NewRGBA(image.Rectangle{
			Min: image.Point{0, 0},
			Max: image.Point{w, h},
		})
		x := rand.Int31n(w)
		y := rand.Int31n(h)
		color := randomColor()
		rgba.Set(int(x), int(y), color)
		cmp.Run(rgba)
	}

	run = false
}
