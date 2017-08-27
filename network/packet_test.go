package network

import (
	"bytes"
	"fmt"
	"log"
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
	buf := make([]byte, 0)
	b := bytes.NewBuffer(buf)
	writer := Writer{b}
	str := "test"

	err := writer.WriteString(str)
	if err != nil {
		log.Fatal(2, err)
	}

	err = writer.WriteInt(10)
	if err != nil {
		log.Fatal(3, err)
	}

	writer.WriteInt(5)

	fmt.Println("[", b.Len(), "]", b.Bytes())

	reader := Reader{b}
	packet, err := reader.ReadPacket(TestPacket{})

	fmt.Println(packet)

	if err != nil {
		fmt.Println(err)
	}
}
