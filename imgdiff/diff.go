package imgdiff

import (
	"fmt"
	"hash/crc32"
	"image"
)

type Cmp struct {
	Sums []uint32
	Data [][]uint8

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
		data[i] = make([]uint8, chunklen)
	}

	return &Cmp{
		Sums:    make([]uint32, length),
		Data:    data,
		columns: c,
		rows:    r,
		w:       w,
		h:       h,
	}
}

// ChunkOffset returns the index in Data of chunk c,r
func (cmp *Cmp) ChunkOffset(c, r int) int {
	return cmp.columns*c + r
}

func (cmp *Cmp) diff(rgba *image.RGBA) {
	cw := cmp.w / cmp.columns
	rh := cmp.h / cmp.rows

	for c := 0; c < cmp.columns; c++ {
		x := c * cw

		for r := 0; r < cmp.rows; r++ {
			y := r * rh

			buf := cmp.Data[cmp.ChunkOffset(c, r)]

			for s := 0; s < rh; s++ {
				offset := s * cw

				los := rgba.PixOffset(x, s+y)
				loe := rgba.PixOffset(x+cw, s+y)
				line := rgba.Pix[los:loe]

				copy(buf[offset:offset+cw], line)
			}

			cmp.Sums[cmp.ChunkOffset(c, r)] = crc32.ChecksumIEEE([]byte(buf))
		}
	}

	fmt.Println(cmp.Sums)
}
