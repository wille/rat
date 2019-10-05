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
