package client

import (
	"encoding/binary"
	"fmt"
	"net"
	"rat/common"
)

type Writer interface {
	WriteVar(i interface{}) error
	WriteInt(int) error
	WriteString(string) error
}

type Reader interface {
	// Can't pass built in types here
	//ReadVar(i *interface{}) error
	ReadInt() (int, error)
	ReadString() (string, error)
}

type Client struct {
	net.Conn
	Writer
	Reader
}

func (c *Client) WriteVar(i interface{}) error {
	return binary.Write(c, common.ByteOrder, &i)
}

func (c *Client) WriteInt(i int32) error {
	return c.WriteVar(i)
}

func (c *Client) WriteString(s string) error {
	err := c.WriteInt(int32(len(s)))

	if err != nil {
		return err
	}

	_, err = fmt.Fprintf(c.Conn, s)
	return err
}

func (c *Client) ReadString() (string, error) {
	n, err := c.ReadInt()

	if err != nil {
		fmt.Println("zaf")
		return "", err
	}

	var s string
	for i := 0; int32(i) < n; i++ {
		var r byte
		err = binary.Read(c.Conn, common.ByteOrder, &r)

		if err != nil {
			break
		}

		s += string(r)
	}

	return s, err
}

func (c *Client) ReadInt() (int32, error) {
	var n int32
	err := binary.Read(c, common.ByteOrder, &n)

	return n, err
}

func (c *Client) ReadHeader() (common.PacketHeader, error) {
	var h common.PacketHeader
	err := binary.Read(c, common.ByteOrder, &h)

	return h, err
}

func (c *Client) WriteHeader(header common.PacketHeader) error {
	return binary.Write(c.Conn, common.ByteOrder, header)
}
