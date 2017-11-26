package network

import (
	"bytes"
	"fmt"
	"io"
	"rat/client/network/header"
	"reflect"
	"testing"
)

type TestPacket struct {
	Text   string   `network:"send,receive"`
	Number int      `network:"send,receive"`
	Array  []string `network:"send,receive"`
	Sub    struct {
		SubInt int `network:"send,receive"`
	} `network:"send,receive"`
	Another int `network:"send,receive"`
}

func (p TestPacket) Header() header.PacketHeader {
	return 0
}

func (p TestPacket) OnReceive() error {
	return nil
}

func serialize(what interface{}) (*bytes.Buffer, error) {
	buf := make([]byte, 0)
	b := bytes.NewBuffer(buf)
	writer := Writer{b}

	err := writer.serialize(what, unknown)
	return b, err
}

func deserialize(from io.Reader, what interface{}) (interface{}, error) {
	reader := Reader{from}
	return reader.deserialize(what, unknown)
}

// Test basic serialization
func TestPacketSerialization(t *testing.T) {
	test := TestPacket{
		Text:    "Text",
		Number:  15,
		Another: 1,
	}

	test.Sub.SubInt = 10
	test.Array = []string{"test1", "test2"}

	b, err := serialize(test)
	if err != nil {
		t.Fatal(err)
	}

	packet, err := deserialize(b, TestPacket{})
	if err != nil {
		t.Fatal(err)
	}

	if !reflect.DeepEqual(test, packet) {
		fmt.Println("in", test)
		fmt.Println("out", packet)
		t.Fail()
	}
}

// Test serialization with nil/not set values in struct
func TestNullSerialization(t *testing.T) {
	test := TestPacket{
		Text: "Text",
	}

	test.Array = []string{"test2"}

	b, err := serialize(test)
	if err != nil {
		t.Fatal(err)
	}

	packet, err := deserialize(b, TestPacket{})
	if err != nil {
		t.Fatal(err)
	}

	if !reflect.DeepEqual(test, packet) {
		fmt.Println("in", test)
		fmt.Println("out", packet)
		t.Fail()
	}
}
