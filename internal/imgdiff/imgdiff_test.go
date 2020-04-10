package imgdiff

import (
	"bytes"
	"image"
	"testing"
	"unsafe"
)

func TestEncoding(t *testing.T) {
	const (
		w = 4
		h = 4
	)

	rgba := image.NewRGBA(image.Rect(0, 0, w, h))
	ptr := *(*[]uint32)(unsafe.Pointer(&rgba.Pix))

	// using a range on a type cast will not work
	// since the slice length and cap is still the same
	for i := 0; i < w*h; i++ {
		ptr[i] = 0xffffffff
	}

	cmp := &Cmp{}
	cmp.Encode(rgba)

	// the initial is fully updated
	if !bytes.Equal(rgba.Pix, cmp.xor.Pix) {
		t.FailNow()
	}

	// no change should be detected
	diff := cmp.Encode(rgba)
	if diff != nil {
		t.FailNow()
	}

	for i := 0; i < w*h; i++ {
		ptr[i] = 0xff0000ff
	}
	diff = cmp.Encode(rgba)
	// the whole image has changed
	if diff.Rect != rgba.Rect {
		t.FailNow()
	}

	// change a pixel and pick up the changes
	ptr[(w*h)-1] = 0x00ffffff
	diff = cmp.Encode(rgba)

	if diff.Rect.Size() != image.Pt(1, 1) {
		t.FailNow()
	}
}

func TestDecoding(t *testing.T) {
	const (
		w = 4
		h = 4
	)

	rgba := image.NewRGBA(image.Rect(0, 0, w, h))
	ptr := *(*[]uint32)(unsafe.Pointer(&rgba.Pix))

	// using a range on a type cast will not work
	// since the slice length and cap is still the same
	for i := 0; i < w*h; i++ {
		ptr[i] = 0xffffffff
	}

	cmp := &Cmp{}
	cmp2 := &Cmp{}
	encoded := cmp.Encode(rgba)
	decoded := cmp2.Decode(encoded)

	if !bytes.Equal(encoded.Pix, decoded.Pix) {
		t.FailNow()
	}

	for x := 0; x < w/2; x++ {
		for y := 0; y < h/2; y++ {
			i := y*w + x
			ptr[i] = 0x00ff00ff
		}
	}

	encoded = cmp.Encode(rgba)
	if encoded.Rect.Size() != image.Pt(w/2, h/2) {
		t.FailNow()
	}

	//should xor
	decoded = cmp2.Decode(encoded)

	if !bytes.Equal(decoded.Pix[:4], rgba.Pix[:4]) {
		t.FailNow()
	}
}
