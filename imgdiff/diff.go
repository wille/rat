package imgdiff

import (
	"hash/crc32"
	"image"
)

// ChangedChunk contains the data of a chunk update
type ChangedChunk struct {
	// Bounds of the chunk on the source image
	Bounds image.Rectangle

	// Chunk rgba data
	Data []uint8
}

// Cmp implements functions for concurrent diffs of images
type Cmp struct {
	// Sums is the crc32's of previous image chunks
	Sums []uint32

	// Data is the rgba data for each chunk
	Data [][]uint8

	C chan ChangedChunk

	columns int
	rows    int
	w       int
	h       int
}

// NewComparer returns a new comparer instance initialized with specified width, height and chunk size
func NewComparer(c, r, w, h int) *Cmp {
	length := r * c
	chunklen := w / c * h / r

	data := make([][]uint8, length)
	for i := 0; i < length; i++ {
		data[i] = make([]uint8, chunklen*4)
	}

	return &Cmp{
		Sums:    make([]uint32, length),
		Data:    data,
		C:       make(chan ChangedChunk),
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
			buf := cmp.Data[co]

			for s := 0; s < rh; s++ {
				offset := s * cw

				los := rgba.PixOffset(x, s+y)
				loe := rgba.PixOffset(x+cw, s+y)
				line := rgba.Pix[los:loe]

				copy(buf[offset:offset+cw], line)
			}

			sum := crc32.ChecksumIEEE([]byte(buf))
			if sum != cmp.Sums[co] {
				cmp.Sums[co] = sum

				cmp.C <- ChangedChunk{
					Bounds: image.Rectangle{
						Min: image.Point{x, y},
						Max: image.Point{x + cw, y + rh},
					},
					Data: buf,
				}
			}
		}
	}
}
