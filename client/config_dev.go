//+build !prod

package main

import (
	"encoding/json"
	"fmt"
	"os"
	"rat/common"
)

const ConfigFile = "config.json"

var Config common.BinaryConfig

func ParseConfig() error {
	file, err := os.Open(ConfigFile)
	defer file.Close()
	if err != nil {
		return err
	}

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
