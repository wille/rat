package main

import (
	"crypto/tls"
	"fmt"
)

func main() {
	err := ParseConfig()
	if err != nil {
		fmt.Println(err.Error())
		return
	}

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

		Queue = make(chan OutgoingPacket)

		con := Connection{
			Conn: conn,
		}

		go func() {
			for {
				packet := <-Queue
				con.WritePacket(packet)
			}
		}()

		con.Init()

		for {
			header, err := con.ReadHeader()

			if err != nil {
				fmt.Println(err.Error())
				con.Close()
				break
			}

			packet := GetIncomingPacket(header)
			err = packet.Read(&con)

			if err != nil {
				fmt.Println(err.Error())
				con.Close()
				break
			}
		}
	}
}
