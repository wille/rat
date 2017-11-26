package network

import (
	"encoding/binary"
	"io"
	"log"

	"gopkg.in/mgo.v2/bson"
)

type Writer struct {
	Writer io.Writer
}

func (w Writer) writeBool(b bool) error {
	return binary.Write(w.Writer, ByteOrder, b)
}

func (w Writer) writeInt32(i int32) error {
	return binary.Write(w.Writer, ByteOrder, int32(i))
}

func (w Writer) writeInt64(i int64) error {
	return binary.Write(w.Writer, ByteOrder, int64(i))
}

func (w Writer) writeFloat32(i float32) error {
	return binary.Write(w.Writer, ByteOrder, &i)
}

func (w Writer) writeFloat64(i float64) error {
	return binary.Write(w.Writer, ByteOrder, &i)
}

func (w Writer) writeString(s string) error {
	w.writeInt32(int32(len(s)))

	w.Writer.Write([]byte(s))

	return nil
}

func (w Writer) writeBytes(b []byte) error {
	_, err := w.Writer.Write(b)

	return err
}

func (w Writer) WritePacket(packet interface{}) error {
	data, err := bson.Marshal(packet)
	if err != nil {
		log.Fatal(err.Error())
	}
	w.writeInt32(int32(len(data)))
	w.writeBytes(data)
	return err
}
