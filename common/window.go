package common

// Desktop window dimensions
type Rect struct {
	X      int
	Y      int
	Width  int
	Height int
}

// A desktop window
type Window struct {
	// Window handle, identifier for window
	Handle int

	// Window title
	Title string

	// Window dimensions
	Rect Rect
}
