package network

import (
	"encoding/binary"
	"fmt"
	"io"
	"rat/common"
	"reflect"
)

type Reader struct {
	Reader io.Reader
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

func (r Reader) ReadPacket(packet Packet) (Packet, error) {
	pstruct := reflect.New(reflect.TypeOf(packet)).Elem()
	ptype := pstruct.Type()

	fmt.Println("reading", pstruct.Type())

	var err error

	for i := 0; i < pstruct.NumField(); i++ {
		field := pstruct.Field(i)
		fieldType := ptype.Field(i)

		fmt.Println("setting", fieldType.Name, "("+field.Type().Name()+")")

		switch field.Interface().(type) {
		case string:
			var s string
			s, err = r.ReadString()
			field.SetString(s)
		case int:
			var n int
			n, err = r.ReadInt()
			field.SetInt(int64(n))
		}

		fmt.Println("\tto", field.Interface())

		if err != nil {
			break
		}
	}

	return packet, err
}
