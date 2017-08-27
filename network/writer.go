package network

import (
	"encoding/binary"
	"io"
	"rat/common"
)

type Writer struct {
	Writer io.Writer
}

func (w Writer) WriteInt(i int) error {
	return binary.Write(w.Writer, common.ByteOrder, int32(i))
}

func (w Writer) WriteString(s string) error {
	w.WriteInt(len(s))

	w.Writer.Write([]byte(s))

	return nil
}
