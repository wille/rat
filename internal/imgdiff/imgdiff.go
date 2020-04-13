package imgdiff

import (
	"fmt"
	"image"
	"unsafe"
)

// Cmp implements functions for concurrent diffs of images
type Cmp struct {
	prev *image.RGBA
	xor  *image.RGBA

	Mask uint32
}

// NewComparer returns a new comparer instance initialized with specified width, height and chunk size
func NewComparer() *Cmp {
	return &Cmp{}
}

// Encode takes the new input image and XORs it with the previous image
// and returns the difference.
// The rectangle of the returned image is the bounds containing the changes.
// If no previous image exists, one will be created
func (cmp *Cmp) Encode(input *image.RGBA) *image.RGBA {
	if cmp.xor == nil || cmp.prev == nil {
		cmp.prev = image.NewRGBA(input.Rect)
		cmp.xor = image.NewRGBA(input.Rect)
	}

	if input.Rect != cmp.prev.Rect {
		panic(fmt.Sprintf("input image bounds %s does not match bounds %s", input.Rect, cmp.prev.Rect))
	}

	mask := cmp.Mask
	if mask == 0 {
		mask = 0xffffffff
	}

	prevbuf := *(*[]uint32)(unsafe.Pointer(&cmp.prev.Pix))
	xorbuf := *(*[]uint32)(unsafe.Pointer(&cmp.xor.Pix))
	rawbuf := *(*[]uint32)(unsafe.Pointer(&input.Pix))

	changedBounds := image.Rectangle{
		Min: input.Rect.Max,
	}
	w := input.Rect.Dx()
	for y := input.Rect.Min.Y; y < input.Rect.Max.Y; y++ {
		for x := 0; x < w; x++ {
			offset := y*w + x
			xd := (prevbuf[offset] ^ rawbuf[offset]) & mask
			xorbuf[offset] = xd
			if xd != 0 {
				if y < changedBounds.Min.Y {
					changedBounds.Min.Y = y
				}
				if x < changedBounds.Min.X {
					changedBounds.Min.X = x
				}
				if x > changedBounds.Max.X {
					changedBounds.Max.X = x
				}
				if y > changedBounds.Max.Y {
					changedBounds.Max.Y = y
				}
			}
		}
	}

	if changedBounds.Max != image.ZP {
		changedBounds.Max.X++
		changedBounds.Max.Y++
	}

	if changedBounds.Min == input.Rect.Size() || changedBounds.Empty() {
		return nil
	}

	copy(cmp.prev.Pix, input.Pix)

	return cmp.xor.SubImage(changedBounds.Canon()).(*image.RGBA)
}

// Decode decodes the XORd input image and returns the changed part of the image
func (cmp *Cmp) Decode(input *image.RGBA) *image.RGBA {
	if cmp.prev == nil {
		cmp.prev = image.NewRGBA(image.Rect(0, 0, input.Rect.Dx(), input.Rect.Dy()))
	}

	if !input.Rect.In(cmp.prev.Rect) {
		panic(fmt.Sprintf("input image bounds %s is not within %s", input.Rect, cmp.prev.Rect))
	}

	prev32 := *(*[]uint32)(unsafe.Pointer(&cmp.prev.Pix))
	decompressed32 := *(*[]uint32)(unsafe.Pointer(&input.Pix))

	var i int
	for y := input.Rect.Min.Y; y < input.Rect.Max.Y; y++ {
		ypos := cmp.prev.PixOffset(input.Rect.Min.X, y) / 4
		for x := ypos; x < ypos+input.Rect.Dx(); x++ {
			prev32[x] ^= decompressed32[i]
			i++
		}
	}

	return cmp.prev.SubImage(input.Rect).(*image.RGBA)
}
