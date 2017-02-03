//+build prod

package main

import (
	"encoding/binary"
	"encoding/json"
	"fmt"
	"os"
	"rat/common"
)

var Config common.BinaryConfig

func ParseConfig() error {
	this := os.Args[0]

	f, err := os.Open(this)
	if err != nil {
		return err
	}

	stat, err := f.Stat()
	if err != nil {
		return err
	}

	// Read offset from end of file (64 bits)
	f.Seek(stat.Size()-8, 0)
	var offset int64
	binary.Read(f, common.ByteOrder, &offset)
	fmt.Println("Offset:", offset)

	// Read config from offset
	f.Seek(offset, 0)
	b := make([]byte, stat.Size()-offset-8)
	f.Read(b)

	err = json.Unmarshal(b, &Config)
	fmt.Println("Decoded config:", Config)

	return err
}
