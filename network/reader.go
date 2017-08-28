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

func (r Reader) ReadInt32() (int32, error) {
	var n int32
	err := binary.Read(r.Reader, common.ByteOrder, &n)
	return n, err
}

func (r Reader) ReadInt64() (int64, error) {
	var n int64
	err := binary.Read(r.Reader, common.ByteOrder, &n)
	return n, err
}

func (r Reader) ReadString() (string, error) {
	len, err := r.ReadInt32()
	buf := make([]byte, len)
	io.ReadFull(r.Reader, buf)

	return string(buf), err
}

func (r Reader) ReadPacket(packet Packet) (Packet, error) {
	e, err := deserialize(r, packet)
	return e.(Packet), err
}

func deserialize(r Reader, data interface{}) (interface{}, error) {
	pstruct := reflect.New(reflect.TypeOf(data)).Elem()
	ptype := pstruct.Type()

	var err error

	for i := 0; i < pstruct.NumField(); i++ {
		field := pstruct.Field(i)
		fieldType := ptype.Field(i)

		fmt.Print("setting ", fieldType.Name, " ("+field.Type().Name()+") ")

		switch fieldType.Type.Kind() {
		case reflect.String:
			var s string
			s, err = r.ReadString()
			field.SetString(s)
		case reflect.Int:
			fallthrough
		case reflect.Int32:
			var n int32
			n, err = r.ReadInt32()
			field.SetInt(int64(n))
		case reflect.Int64:
			var n int64
			n, err = r.ReadInt64()
			field.SetInt(n)
		case reflect.Struct:
			var e interface{}
			e, err = deserialize(r, field.Interface())
			if err != nil {
				break
			}

			field.Set(reflect.ValueOf(e))
		}

		fmt.Println("=>", field.Interface())

		if err != nil {
			break
		}
	}

	return pstruct.Interface(), err
}
