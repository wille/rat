package shared

// Desktop window dimensions
type Rect struct {
	X      int `json:"x"`
	Y      int `json:"y"`
	Width  int `json:"w"`
	Height int `json:"h"`
}

// A desktop window
type Window struct {
	// Window handle, identifier for window
	Handle int `json:"handle"`

	// Window title
	Title string `json:"title,omitempty"`

	// Window dimensions
	Rect Rect `json:"rect,omitempty"`
}
