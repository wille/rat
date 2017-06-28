package main

import "fmt"

type SysPacket Packet

func (packet SysPacket) Read(c *Connection) error {
	action, err := c.ReadInt()
	if err != nil {
		return err
	}

	fmt.Println("action", action)
	return nil
}
