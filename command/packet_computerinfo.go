package main

type ComputerInfoPacket struct {
	Username               string `receive`
	Hostname               string `receive`
	OperatingSystemType    string `receive`
	OperatingSystemDisplay string `receive`
}

func (packet *ComputerInfoPacket) OnReceive(c *Client) error {
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
