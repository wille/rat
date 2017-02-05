package main

import (
	"rat/common"
)

type UploadPacket struct {
	File  string
	Final bool
	Data  []byte
}

func (packet UploadPacket) GetHeader() common.PacketHeader {
	return common.TransferHeader
}

func (packet UploadPacket) Write(c *Client) error {
	c.WriteString(packet.File)
	c.WriteBool(packet.Final)

	c.WriteInt(len(packet.Data))
	c.Conn.Write(packet.Data)

	return nil
}

func (packet UploadPacket) Read(c *Client) error {
	return nil
}
