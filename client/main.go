package main

import (
	"crypto/tls"
	"fmt"
)

func main() {
	InitPackets()

	for {
		host := "localhost:9999"
		fmt.Println("Connecting to", host)

		conn, err := tls.Dial("tcp", host, &tls.Config{
			InsecureSkipVerify: true,
		})

		if err != nil {
			fmt.Println(err.Error())
			continue
		}

		con := Connection{
			Conn: conn,
		}

		con.Init()

		for {
			header, err := con.ReadHeader()

			if err != nil {
				fmt.Println(err.Error())
				conn.Close()
				break
			}

			packet := GetIncomingPacket(header)
			err = packet.Read(&con)

			if err != nil {
				fmt.Println(err.Error())
				conn.Close()
				break
			}
		}
	}
}
