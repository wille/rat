package main

import (
	"fmt"
	"rat/common"
	"strconv"

	"golang.org/x/net/websocket"
)

type ProcessPacket struct {
}

func (packet ProcessPacket) GetHeader() common.PacketHeader {
	return common.ProcessHeader
}

func (packet ProcessPacket) Write(c *Client) error {
	return nil
}

func (packet ProcessPacket) Read(c *Client) error {
	len, _ := c.ReadInt()

	for i := 0; i < len; i++ {
		pid, err := c.ReadInt()
		name, err := c.ReadString()

		if err != nil {
			fmt.Println("process:", err.Error())
		}

		event := newEvent(ProcessQueryEvent, c.Id, strconv.Itoa(pid)+","+name)

		err = websocket.JSON.Send(c.ws, &event)

		if err != nil {
			return err
		}
	}

	return nil
}
