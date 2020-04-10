package imgdiff

import (
	"image"
	"io"
)

// Write writes a bitmap with shared underlying Pix buffer
func Write(w io.Writer, img *image.RGBA) error {
	i0 := 0
	i1 := img.Rect.Dx() * 4

	for y := img.Rect.Min.Y; y < img.Rect.Max.Y; y++ {
		if _, err := w.Write(img.Pix[i0:i1]); err != nil {
			return err
		}

		i0 += img.Stride
		i1 += img.Stride
	}

	return nil
}

func Bytes(image *image.RGBA) []byte {
	i0 := 0
	i1 := image.Rect.Dx() * 4

	buf := make([]byte, image.Rect.Dx()*image.Rect.Dy()*4)

	for y := image.Rect.Min.Y; y < image.Rect.Max.Y; y++ {
		copy(buf[i0:], image.Pix[i0:i1])

		i0 += image.Stride
		i1 += image.Stride
	}

	return buf
}

