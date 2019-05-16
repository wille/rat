package imgdiff

import (
	"hash/crc32"
	"image"
	"unsafe"
)

// Cmp implements functions for concurrent diffs of images
type Cmp struct {
	// Sums is the crc32's of previous image chunks
	prev *image.RGBA
	xor  *image.RGBA

	C chan *image.RGBA

	columns int
	rows    int
}

// NewComparer returns a new comparer instance initialized with specified width, height and chunk size
func NewComparer(c, r int) *Cmp {
	return &Cmp{
		C:       make(chan *image.RGBA),
		columns: c,
		rows:    r,
	}
}

func (cmp *Cmp) chunkOffset(c, r int) int {
	return cmp.columns*c + r
}

func sum(p *image.RGBA) uint32 {
	var sum uint32

	i0 := 0
	i1 := p.Rect.Dx() * 4

	for y := p.Rect.Min.Y; y < p.Rect.Max.Y; y++ {
		sum = crc32.Update(sum, crc32.IEEETable, p.Pix[i0:i1])

		i0 += p.Stride
		i1 += p.Stride
	}

	return sum
}

func (cmp *Cmp) diff(prev, curr *image.RGBA) bool {
	c := false

	xoffset := cmp.xor.PixOffset(curr.Rect.Min.X, curr.Rect.Min.Y)

	ptr0 := uintptr(unsafe.Pointer(&prev.Pix[0]))
	ptr1 := uintptr(unsafe.Pointer(&curr.Pix[0]))
	ptrx := uintptr(unsafe.Pointer(&cmp.xor.Pix[xoffset]))

	i0 := 0
	i1 := curr.Rect.Dx() * 4

	for y := curr.Rect.Min.Y; y < curr.Rect.Max.Y; y++ {
		for x := i0; x < i1; x += 4 {
			xor := *(*int32)(unsafe.Pointer(ptr0 + uintptr(x))) ^ *(*int32)(unsafe.Pointer(ptr1 + uintptr(x)))
			*(*int32)(unsafe.Pointer(ptrx + uintptr(x))) = xor
			*(*int32)(unsafe.Pointer(ptr0 + uintptr(x))) = *(*int32)(unsafe.Pointer(ptr1 + uintptr(x)))

			if xor != 0 {
				c = true
			}
		}

		i0 += curr.Stride
		i1 += curr.Stride
	}

	return c
}

// Update starts comparing image and sends updated chunks to channel C
// comparing for the first time will send all chunks as updated
// good for asynchronous rendering on the receiver side
func (cmp *Cmp) Update(rgba *image.RGBA) {
	if cmp.prev == nil {
		cmp.prev = image.NewRGBA(image.Rectangle{
			Max: rgba.Rect.Size(),
		})
		cmp.xor = image.NewRGBA(image.Rectangle{
			Max: rgba.Rect.Size(),
		})
	}

	cw := rgba.Rect.Dx() / cmp.columns
	rh := rgba.Rect.Dy() / cmp.rows

	for c := 0; c < cmp.columns; c++ {
		x := c * cw

		for r := 0; r < cmp.rows; r++ {
			y := r * rh

			rect := image.Rectangle{
				Min: image.Point{x, y},
				Max: image.Point{x + cw, y + rh},
			}

			prev := cmp.prev.SubImage(rect).(*image.RGBA)
			curr := rgba.SubImage(rect).(*image.RGBA)

			if cmp.diff(prev, curr) {
				cmp.C <- cmp.xor.SubImage(rect).(*image.RGBA)
			}
		}
	}
}
