package network

import (
	"encoding/binary"
	"io"
	"rat/common"
	"reflect"
)

type Writer struct {
	Writer io.Writer
}

func (w Writer) WriteInt32(i int32) error {
	return binary.Write(w.Writer, common.ByteOrder, int32(i))
}

func (w Writer) WriteInt64(i int64) error {
	return binary.Write(w.Writer, common.ByteOrder, int64(i))
}

func (w Writer) WriteString(s string) error {
	w.WriteInt32(int32(len(s)))

	w.Writer.Write([]byte(s))

	return nil
}

func (w Writer) WritePacket(packet Packet) error {
	return serialize(w, packet)
}

func serialize(w Writer, data interface{}) error {
	pstruct := reflect.ValueOf(data)
	ptype := pstruct.Type()

	var err error

	for i := 0; i < pstruct.NumField(); i++ {
		field := pstruct.Field(i)
		fieldType := ptype.Field(i)

		if fieldType.Tag != "send" && fieldType.Tag != "both" {
			continue
		}

		err = serializeField(w, field, fieldType.Type)

		if err != nil {
			break
		}
	}

	return err
}

func serializeField(w Writer, field reflect.Value, d reflect.Type) error {
	var err error

	switch d.Kind() {
	case reflect.String:
		w.WriteString(field.String())
	case reflect.Int:
		fallthrough
	case reflect.Int32:
		w.WriteInt32(int32(field.Int()))
	case reflect.Int64:
		w.WriteInt64(field.Int())
	case reflect.Struct:
		err = serialize(w, field.Interface())
	case reflect.Array:
		fallthrough
	case reflect.Slice:
		w.WriteInt32(int32(field.Len()))

		for i := 0; i < field.Len(); i++ {
			serializeField(w, field.Index(i), field.Index(i).Type())
		}
	}

	return err
}
