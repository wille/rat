package main

import (
	"crypto/tls"
	"fmt"
)

var (
	// Clients are all connected clients to this server
	Clients []*Client
)

type Server struct {
	Address     string `json:"host"`
	HttpAddress string `json:"http"`
	Password    string `json:"password"`
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

		client := NewClient(conn)

		go client.PacketReader()
		go client.Heartbeat()
		go client.PacketQueue()
	}
}

func add(client *Client) {
	Clients = append(Clients, client)

	update(NewClientEvent(Add, client, client.GetClientData()))
}

func remove(client *Client) {
	for k, v := range Clients {
		if v.Id == client.Id {
			Clients = append(Clients[:k], Clients[k+1:]...)
			break
		}
	}

	update(NewClientEvent(Remove, client, nil))
}

func update(e ClientMessage) error {
	return sendMessage(globalws, nil, e)
}

func updateAll() {
	for _, client := range Clients {
		update(NewClientEvent(Add, client, client.GetClientData()))
	}
}

func get(id int) *Client {
	for _, v := range Clients {

		if v.Id == id {
			return v
		}
	}

	return nil
}
