package main

import (
	"fmt"
	"rat/shared"

	"gopkg.in/mgo.v2/bson"
)

type ComputerInfoPacket struct {
	Username        string
	Hostname        string
	OperatingSystem struct {
		Type    string
		Display string
	} `os`
	Monitors []shared.Monitor
}

func (packet ComputerInfoPacket) OnReceive(c *Client) error {
	c.Computer.Username = packet.Username
	c.Computer.Hostname = packet.Hostname
	c.Computer.OperatingSystemType = packet.OperatingSystem.Type
	c.Computer.OperatingSystem = packet.OperatingSystem.Display

	fmt.Println(c.Computer, packet)

	if !c.Authenticated {
		add(c)
		c.Authenticated = true
	}

	return nil
}

func (packet ComputerInfoPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
