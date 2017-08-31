package main

import (
	"rat/shared/network/header"
)

type UploadPacket struct {
	File  string `network:"send"`
	Final bool   `network:"send"`
	Data  []byte `network:"send"`
}

func (packet UploadPacket) Header() header.PacketHeader {
	return header.PutFileHeader
}

func (packet UploadPacket) Init(c *Client) {

}

func (packet UploadPacket) OnReceive(c *Client) error {
	return nil
}
