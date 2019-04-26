package main

import (
	"io"
	"rat/shared/network/header"
)

type Outgoing interface {
	Header() header.PacketHeader
	Write(io.ReadWriter, *Client) error
}

type Incoming interface {
	Read(io.ReadWriter, *Client) error
}

type Channel interface {
	Header() header.PacketHeader
	Open(io.ReadWriteCloser, *Client) error
}
