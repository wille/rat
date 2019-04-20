package main

import (
	"rat/command/utils"
	"rat/shared/network/header"

	"time"

	"gopkg.in/mgo.v2/bson"
)

type Ping struct {
}

func (packet Ping) Header() header.PacketHeader {
	return header.PingHeader
}

func (packet Ping) Init(c *Client) {
	c.Ping.Start = time.Now()
	c.Ping.Received = false
}

func (packet Ping) OnReceive(c *Client) error {
	c.Ping.Current = int(utils.GetMilliseconds(time.Now()) - utils.GetMilliseconds(c.Ping.Start))
	c.Ping.Received = true

	broadcast(NewClientEvent(Update, c, ClientData{
		Ping: c.Ping.Current,
	}))

	return nil
}

func (packet Ping) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
