package incoming

import "rat/command/client"

type Ping struct {
	Packet
}

func (packet Ping) Read(c *client.Client) error {
	return nil
}
