package imgdiff

import (
	"fmt"
	"hash/crc32"
	"image"
)

const (
	rows    = 2
	columns = 2
)

type Cmp struct {
	Sums [columns][rows]uint32
	Data [columns][rows][8 * 8]uint8
}

func (c *Cmp) Init() {}

func (cmp Cmp) diff(rgba *image.RGBA) {
	w := rgba.Bounds().Max.X
	h := rgba.Bounds().Max.Y

	cw := w / columns
	rh := h / rows

	for c := 0; c < columns; c++ {
		x := c * cw

		for r := 0; r < rows; r++ {
			y := r * rh

			buf := cmp.Data[c][r]

			for s := 0; s < rh; s++ {
				offset := s * cw

				los := rgba.PixOffset(x, s+y)
				loe := rgba.PixOffset(x+cw, s+y)
				line := rgba.Pix[los:loe]

				copy(buf[offset:offset+cw], line)
			}

			cmp.Sums[c][r] = crc32.ChecksumIEEE([]byte(buf[:]))
		}
	}

	fmt.Println(cmp.Sums)
}
