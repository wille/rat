package network2

import (
	"io"
)

type Incoming interface {
	Read(io.ReadWriteCloser) error
}
