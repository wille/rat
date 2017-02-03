package common

// BinaryConfig is written to the built binary
type BinaryConfig struct {
	Host  string `json:"host"`
	Delay int    `json:"delay"`
}
