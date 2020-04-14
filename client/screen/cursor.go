package screen

import (
	"image"
)

type Cursor struct {
	Icon       *image.RGBA
	IconWidth  int
	IconHeight int
	HotX       int
	HotY       int
	X          int
	Y          int
}
