package network

import (
	"encoding/binary"
	"fmt"
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

		fmt.Println("sending", fieldType.Name, "("+field.Type().Name()+")", "=>", field.Interface())

		switch fieldType.Type.Kind() {
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
			if err != nil {
				break
			}
		}

		if err != nil {
			break
		}
	}

	return err
}
