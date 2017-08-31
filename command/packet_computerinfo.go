package main

type ComputerInfoPacket struct {
	Username               string `network:"receive"`
	Hostname               string `network:"receive"`
	OperatingSystemType    string `network:"receive"`
	OperatingSystemDisplay string `network:"receive"`
}

func (packet ComputerInfoPacket) OnReceive(c *Client) error {
	c.Computer.Username = packet.Username
	c.Computer.Hostname = packet.Hostname
	c.Computer.OperatingSystemType = packet.OperatingSystemType
	c.Computer.OperatingSystem = packet.OperatingSystemDisplay

	if !c.Authenticated {
		add(c)
		c.Authenticated = true
	}

	return nil
}
