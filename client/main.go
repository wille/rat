package main

import "crypto/tls"

func main() {
	InitPackets()

	service := "localhost:9999"

	conn, err := tls.Dial("tcp", service, &tls.Config{
		InsecureSkipVerify: true,
	})

	if err != nil {
		panic(err)
	}

	con := Connection{
		Conn: conn,
	}

	for {
		header, err := con.ReadHeader()

		if err != nil {
			panic(err)
		}

		packet := GetIncomingPacket(header)
		err = packet.Read(&con)

		if err != nil {
			panic(err)
		}
	}

}
