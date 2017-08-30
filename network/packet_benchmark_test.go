package network

import (
	"bytes"
	"fmt"
	"math/rand"
	"rat/common"
	"reflect"
	"testing"
)

type BenchmarkPacket struct {
	Text string
	Sub  struct {
		Array []int
	}
	ByteArray []byte
}

func (p BenchmarkPacket) Header() common.PacketHeader {
	return 0
}

func (p BenchmarkPacket) OnReceive() error {
	return nil
}

func BenchmarkSerialization(b *testing.B) {
	for i := 0; i < b.N; i++ {
		test := BenchmarkPacket{
			Text: "Text",
		}

		test.ByteArray = make([]byte, 8)
		rand.Read(test.ByteArray)

		buf := make([]byte, 0)
		bd := bytes.NewBuffer(buf)
		writer := Writer{bd}

		err := writer.serialize(test)
		if err != nil {
			b.Error(err)
		}

		fmt.Println(test)

		reader := Reader{bd}
		packet, err := reader.deserialize(BenchmarkPacket{})
		if err != nil {
			b.Error(err)
		}

		fmt.Println(packet)

		if !reflect.DeepEqual(test, packet) {
			b.Error("no match")
		}
	}
}
