package shared

import (
	"encoding/binary"
	"errors"
	"io"
)

type Writer interface {
	WriteInt(int) error
	WriteString(string) error
}

type Reader interface {
	// Can't pass built in types here
	//ReadVar(i *interface{}) error
	ReadInt() (int, error)
	ReadString() (string, error)
}

// ReadString helper function
func ReadString(r io.Reader) (string, error) {
	var len int32
	binary.Read(r, binary.LittleEndian, &len)
	if len > 1024<<5 {
		return "", errors.New("string too long")
	}

	b := make([]byte, int(len))
	_, err := io.ReadFull(r, b)
	return string(b), err
}

// WriteString helper function
func WriteString(w io.Writer, s string) error {
	b := []byte(s)

	binary.Write(w, binary.LittleEndian, int32(len(b)))
	_, err := w.Write(b)

	return err
}
