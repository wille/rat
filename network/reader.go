package network

import (
	"encoding/binary"
	"io"
	"rat/common"
)

type Reader struct {
	io.Reader
}

func (r Reader) ReadBool() (bool, error) {
	var n bool
	err := binary.Read(r.Reader, common.ByteOrder, &n)
	return n, err
}

func (r Reader) ReadInt() (int, error) {
	var n int32
	err := binary.Read(r.Reader, common.ByteOrder, &n)
	return int(n), err
}

func (r Reader) ReadString() (string, error) {
	len, err := r.ReadInt()

	buf := make([]byte, len)
	io.ReadFull(r.Reader, buf)

	return string(buf), err
}
