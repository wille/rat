package screen

import (
	"image"
)

type Cursor struct {
	Bitmap *image.RGBA
	HotX   int
	HotY   int
	X      int
	Y      int
}
