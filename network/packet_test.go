package network

import (
	"bytes"
	"fmt"
	"testing"
)

type TestPacket struct {
	Text   string
	Number int
	Sub    struct {
		SubInt int
	}
}

func (p TestPacket) header() int {
	return 0
}

func TestS(t *testing.T) {
	test := TestPacket{
		Text:   "Text",
		Number: 15,
	}

	test.Sub.SubInt = 10

	buf := make([]byte, 0)
	b := bytes.NewBuffer(buf)
	writer := Writer{b}

	writer.WritePacket(test)

	fmt.Println("[", b.Len(), "]", b.Bytes())

	reader := Reader{b}
	packet, err := reader.ReadPacket(TestPacket{})

	fmt.Println(packet)

	if err != nil {
		fmt.Println(err)
	}
}
