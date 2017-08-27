package network

import (
	"fmt"
	"reflect"
)

// Packet
type Packet interface {
	header() int
}

// TestPacket
type TestPacket struct {
	Count    int
	UserName string
}

func (p TestPacket) header() int {
	return 0
}

func ReadPacket() {
	p := TestPacket{}
	p.Count = 5
	p.UserName = "yeah brother"

	s := reflect.ValueOf(&p).Elem()
	typ := s.Type()

	fmt.Println("Name:", s.Type())

	for i := 0; i < s.NumField(); i++ {
		field := s.Field(i)
		typeField := typ.Field(i)

		fmt.Println("Name", typeField.Name)
		fmt.Println("Type", field.Type())
		fmt.Println("What", field.Interface())
		fmt.Println()

		switch field.Interface().(type) {
		case string:
			field.SetString("ok")
			fmt.Println(field.Interface())
		}
	}
}
