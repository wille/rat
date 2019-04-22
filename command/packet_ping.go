package main

import (
	"fmt"
	"io"
	"rat/command/utils"
	"rat/shared/network/header"

	"time"
)

type Ping struct {
}

func (packet Ping) Header() header.PacketHeader {
	return header.PingHeader
}

func (Ping) Write(w io.ReadWriter, c *Client) error {
	c.Ping.Start = time.Now()
	c.Ping.Received = false
	fmt.Println("write ping", c.Ping.Start)
	return nil
}

func (Ping) Read(r io.ReadWriter, c *Client) error {
	c.Ping.Current = int(utils.GetMilliseconds(time.Now()) - utils.GetMilliseconds(c.Ping.Start))
	c.Ping.Received = true

	broadcast(NewClientEvent(Update, c, ClientData{
		Ping: c.Ping.Current,
	}))

	fmt.Println("recv ping", c.Ping.Current)

	return nil
}
