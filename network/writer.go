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

func (w Writer) writeInt32(i int32) error {
	return binary.Write(w.Writer, common.ByteOrder, int32(i))
}

func (w Writer) writeInt64(i int64) error {
	return binary.Write(w.Writer, common.ByteOrder, int64(i))
}

func (w Writer) writeString(s string) error {
	w.writeInt32(int32(len(s)))

	w.Writer.Write([]byte(s))

	return nil
}

func (w Writer) WritePacket(packet Packet) error {
	return Serialize(w, packet)
}

func Serialize(w Writer, data interface{}) error {
	pstruct := reflect.ValueOf(data)
	ptype := pstruct.Type()

	var err error

	for i := 0; i < pstruct.NumField(); i++ {
		field := pstruct.Field(i)
		fieldType := ptype.Field(i)

		if fieldType.Tag == "" || fieldType.Tag != "send" && fieldType.Tag != "both" {
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
		w.writeString(field.String())
	case reflect.Int:
		fallthrough
	case reflect.Int32:
		w.writeInt32(int32(field.Int()))
	case reflect.Int64:
		w.writeInt64(field.Int())
	case reflect.Struct:
		err = Serialize(w, field.Interface())
	case reflect.Array:
		fallthrough
	case reflect.Slice:
		w.writeInt32(int32(field.Len()))

		for i := 0; i < field.Len(); i++ {
			serializeField(w, field.Index(i), field.Index(i).Type())
		}
	}

	return err
}
