package main

type Username struct {
	IncomingPacket
}

func (packet Username) Read(c *Client) error {
	username, err := c.ReadString()

	if err != nil {
		return err
	}

	c.Username = username
	return nil
}
