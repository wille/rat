package network

import (
	"crypto/rand"
	"reflect"
	"testing"
)

type BenchmarkPacket struct {
	Text      string
	ByteArray []byte
}

// Benchmark serialization of struct with random bytes
func BenchmarkSerialization(b *testing.B) {
	for i := 0; i < b.N; i++ {
		test := BenchmarkPacket{
			Text: "Text",
		}

		test.ByteArray = make([]byte, b.N)
		rand.Read(test.ByteArray)

		buf, err := serialize(test)
		if err != nil {
			b.Fatal(err)
		}

		packet, err := deserialize(buf, BenchmarkPacket{})
		if err != nil {
			b.Fatal(err)
		}

		if !reflect.DeepEqual(test, packet) {
			b.Fatal("no match")
		}
	}
}
