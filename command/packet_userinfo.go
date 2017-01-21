package main

type UserInfo struct {
	IncomingPacket
}

func (packet UserInfo) Read(c *Client) error {
	username, err := c.ReadString()

	if err != nil {
		return err
	}

	c.Username = username
	return nil
}
