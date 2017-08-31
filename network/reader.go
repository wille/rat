package network

import (
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"rat/common"
	"reflect"
	"strings"
)

type Reader struct {
	Reader io.Reader
}

func (r Reader) readBool() (bool, error) {
	var n bool
	err := binary.Read(r.Reader, common.ByteOrder, &n)
	return n, err
}

func (r Reader) readInt32() (int32, error) {
	var n int32
	err := binary.Read(r.Reader, common.ByteOrder, &n)
	return n, err
}

func (r Reader) readInt64() (int64, error) {
	var n int64
	err := binary.Read(r.Reader, common.ByteOrder, &n)
	return n, err
}

func (r Reader) readFloat32() (float32, error) {
	var n float32
	err := binary.Read(r.Reader, common.ByteOrder, &n)
	return n, err
}

func (r Reader) readFloat64() (float64, error) {
	var n float64
	err := binary.Read(r.Reader, common.ByteOrder, &n)
	return n, err
}

func (r Reader) readString() (string, error) {
	len, err := r.readInt32()
	buf := make([]byte, len)
	io.ReadFull(r.Reader, buf)

	return string(buf), err
}

func (r Reader) ReadPacket(data interface{}) (interface{}, error) {
	return r.deserialize(data, unknown)
}

// deserialize deserializes the input struct.
// Must not be pointer
// Returns new instance of the value, leaving the input interface{} untouched
func (r Reader) deserialize(data interface{}, parentTag tagType) (interface{}, error) {
	pstruct := reflect.New(reflect.TypeOf(data)).Elem()
	ptype := pstruct.Type()

	var err error

	for i := 0; i < pstruct.NumField(); i++ {
		field := pstruct.Field(i)
		fieldType := ptype.Field(i)

		if parentTag != receive {
			t := fieldType.Tag.Get(tag)
			tags := strings.Split(t, ",")

			for _, tag := range tags {
				if tag == "receive" {
					parentTag = receive
					goto run
				} else if tag == "" {
					fmt.Println("empty tag for field", fieldType.Name)
				}
			}
		}

	run:
		err := r.deserializeField(field, fieldType.Type, parentTag)
		if err != nil {
			break
		}
	}

	return pstruct.Interface(), err
}

func (r Reader) deserializeField(field reflect.Value, fieldType reflect.Type, parentTag tagType) error {
	var err error

	if !field.CanSet() {
		return errors.New("cannot set field")
	}

	switch fieldType.Kind() {
	case reflect.Bool:
		var b bool
		b, err = r.readBool()
		field.SetBool(b)
	case reflect.String:
		var s string
		s, err = r.readString()
		field.SetString(s)
	case reflect.Int:
		fallthrough
	case reflect.Int32:
		var n int32
		n, err = r.readInt32()
		field.SetInt(int64(n))
	case reflect.Int64:
		var n int64
		n, err = r.readInt64()
		field.SetInt(n)
	case reflect.Float32:
		var n float32
		n, err = r.readFloat32()
		field.SetFloat(float64(n))
	case reflect.Float64:
		var n float64
		n, err = r.readFloat64()
		field.SetFloat(n)
	case reflect.Struct:
		var e interface{}
		e, err = r.deserialize(field.Interface(), parentTag)
		if err != nil {
			break
		}

		field.Set(reflect.ValueOf(e))
	case reflect.Array:
		fallthrough
	case reflect.Slice:
		len, _ := r.readInt32()
		slice := reflect.MakeSlice(fieldType, int(len), int(len))

		field.Set(slice)
		if b, ok := slice.Interface().([]byte); ok {
			io.ReadFull(r.Reader, b)
		} else {
			for i := 0; i < int(len); i++ {
				r.deserializeField(slice.Index(i), fieldType.Elem(), parentTag)
			}
		}
	}

	return err
}
