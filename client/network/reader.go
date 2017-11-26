package network

import (
	"encoding/binary"
	"io"


	"github.com/pkg/bson"
)

type Reader struct {
	Reader io.Reader
}

func (r Reader) readBool() (bool, error) {
	var n bool
	err := binary.Read(r.Reader, ByteOrder, &n)
	return n, err
}

func (r Reader) readInt32() (int32, error) {
	var n int32
	err := binary.Read(r.Reader, ByteOrder, &n)
	return n, err
}

func (r Reader) readInt64() (int64, error) {
	var n int64
	err := binary.Read(r.Reader, ByteOrder, &n)
	return n, err
}

func (r Reader) readFloat32() (float32, error) {
	var n float32
	err := binary.Read(r.Reader, ByteOrder, &n)
	return n, err
}

func (r Reader) readFloat64() (float64, error) {
	var n float64
	err := binary.Read(r.Reader, ByteOrder, &n)
	return n, err
}

func (r Reader) readString() (string, error) {
	len, err := r.readInt32()
	buf := make([]byte, len)
	io.ReadFull(r.Reader, buf)

	return string(buf), err
}

func (r Reader) ReadPacket(data interface{}) (interface{}, error) {
	len, err := r.readInt32()

	buf := make([]byte, len)
	io.ReadFull(r.Reader, buf)

	err = bson.Unmarshal(buf, &data)

	return data, err
}
