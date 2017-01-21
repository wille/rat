package main

func main() {
	setConstants()

	config := Server{
		Address: "localhost:9999",
	}
	Listen(&config)
}

func setConstants() {
	InitPackets()
}
