package network

import (
	"encoding/binary"
	"io"
	"rat/common"
)

type Writer struct {
	io.Writer
}

func (w Writer) Write(i interface{}) error {
	var err error

	switch i.(type) {
	case string:
		w.Write(len(i.(string)))
		_, err = w.Writer.Write([]byte(i.(string)))
		return err
	}

	return binary.Write(w.Writer, common.ByteOrder, &i)
}
