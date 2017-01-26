package main

type ComputerInfoPacket struct {
	IncomingPacket
}

func (packet ComputerInfoPacket) Read(c *Client) error {
	username, err := c.ReadString()
	hostname, err := c.ReadString()
	ostype, err := c.ReadString()
	os, err := c.ReadString()

	if err != nil {
		return err
	}

	c.Computer.Username = username
	c.Computer.Hostname = hostname
	c.Computer.OperatingSystemType = ostype
	c.Computer.OperatingSystem = os

	return nil
}
