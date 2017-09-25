package shared

const (
	Reload = iota
	Show
	Minimize
)

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

	Visible bool `json:"visible"`

	// Window dimensions
	Rect Rect `json:"rect,omitempty"`

	Icon string `json:"icon,omitempty"`
}

func (w Window) HasIcon() bool {
	return w.Icon != ""
}
