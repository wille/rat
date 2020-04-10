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

// Bytes extracts the underlying Pix buffer of an image when it's a subimage of another image
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

// BitBlit inserts one bitmap into the other
func BitBlit(src, dst *image.RGBA) {
	i0 := dst.PixOffset(src.Rect.Min.X, src.Rect.Min.Y)
	i1 := i0 + src.Stride

	for y := src.Rect.Min.Y; y < src.Rect.Max.Y; y++ {
		offset := dst.PixOffset(src.Rect.Min.X, y)
		copy(dst.Pix[i0+offset:i1+offset], src.Pix[i0:i1])

		i0 += src.Stride
		i1 += src.Stride
	}
}
