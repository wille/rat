package main

type ComputerInfoPacket struct {
	IncomingPacket
}

func (packet ComputerInfoPacket) Read(c *Client) error {
	username, err := c.ReadString()

	if err != nil {
		return err
	}

	hostname, err := c.ReadString()

	if err != nil {
		return err
	}

	c.Computer.Username = username
	c.Computer.Hostname = hostname

	return nil
}
