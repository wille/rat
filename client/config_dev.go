//+build !prod

package main

import (
	"encoding/json"
	"fmt"
	"os"
	"rat/internal"
)

var ConfigFiles = [...]string{
	"config.json",
	"client/config.json",
}

var Config shared.BinaryConfig

func ParseConfig() error {
	var file *os.File
	var err error

	var current int
	for {
		file, err = os.Open(ConfigFiles[current])
		current++

		if err == nil {
			break
		}
	}

	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		return err
	}

	b := make([]byte, stat.Size())
	file.Read(b)
	err = json.Unmarshal(b, &Config)

	fmt.Println("Decoded config:", Config)

	return err
}
