package main

import (
	"rat/command/networking"
	"rat/command/packets/incoming"
)

func main() {
	setConstants()

	config := networking.Server{
		Address: "localhost:9999",
	}
	networking.Listen(&config)
}

func setConstants() {
	incoming.Init()
}
