package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"time"
)

var GlobalConfig struct {
	// HttpAddress is where the web server will be spawned
	HTTPAddress string `json:"http"`

	// Password is the web server authentication password
	Password string `json:"password"`
}

const (
	// ConfigFile is the global command configuration file
	ConfigFile = "config.json"

	defaultHTTPAddress = "127.0.0.1:7777"
)

func randomPassword() string {
	rand.Seed(time.Now().UnixNano())

	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

	length := 8

	b := make([]byte, length)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}

	return string(b)
}

func init() {
	data, err := ioutil.ReadFile(ConfigFile)

	if err != nil {
		fmt.Printf("failed to load %s: %s, using defaults\n", ConfigFile, err)

		GlobalConfig.HTTPAddress = "127.0.0.1:7777"
		GlobalConfig.Password = randomPassword()

		fmt.Printf("http address:\t%s\n", GlobalConfig.HTTPAddress)
		fmt.Printf("password:\t%s\n", GlobalConfig.Password)
		return
	}

	json.Unmarshal(data, &GlobalConfig)
}
