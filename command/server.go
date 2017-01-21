package main

import (
	"crypto/tls"
	"fmt"
	"time"
)

var (
	// Clients are all connected clients to this server
	Clients []*Client
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

		var client Client
		client.Conn = conn
		Clients = append(Clients, &client)
		go handleClient(&client)
		go heartbeat(&client)
	}
}

func handleClient(client *Client) {
	for {
		header, err := client.ReadHeader()

		if err != nil {
			break
		}

		packet := GetIncomingPacket(header)
		err = packet.Read(client)

		if err != nil {
			fmt.Println(err)
		}
	}
}

func heartbeat(client *Client) {
	for {
		time.Sleep(time.Second * 2)
		client.WritePacket(Ping{})
	}
}
