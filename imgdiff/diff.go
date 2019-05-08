package imgdiff

import (
	"hash/crc32"
	"image"
)

// Cmp implements functions for concurrent diffs of images
type Cmp struct {
	// Sums is the crc32's of previous image chunks
	Sums []uint32

	C chan *image.RGBA

	columns int
	rows    int
	w       int
	h       int
}

// NewComparer returns a new comparer instance initialized with specified width, height and chunk size
func NewComparer(c, r, w, h int) *Cmp {
	return &Cmp{
		Sums:    make([]uint32, r*c),
		C:       make(chan *image.RGBA),
		columns: c,
		rows:    r,
		w:       w,
		h:       h,
	}
}

func (cmp *Cmp) chunkOffset(c, r int) int {
	return cmp.columns*c + r
}

// Run starts comparing image and sends updated chunks to channel C
// comparing for the first time will send all chunks as updated
// good for asynchronous rendering on the receiver side
func (cmp *Cmp) Run(rgba *image.RGBA) {
	cw := cmp.w / cmp.columns
	rh := cmp.h / cmp.rows

	for c := 0; c < cmp.columns; c++ {
		x := c * cw

		for r := 0; r < cmp.rows; r++ {
			y := r * rh
			co := cmp.chunkOffset(c, r)

			rect := image.Rectangle{
				Min: image.Point{x, y},
				Max: image.Point{x + cw, y + rh},
			}

			part := rgba.SubImage(rect).(*image.RGBA)

			sum := crc32.ChecksumIEEE([]byte(part.Pix[:4])) // todo first pix
			if sum != cmp.Sums[co] {
				cmp.Sums[co] = sum

				cmp.C <- part
			}
		}
	}
}
