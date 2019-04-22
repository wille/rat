package main

import "io"

type Incoming interface{}

type Channel interface {
	Open(io.ReadWriteCloser, *Connection)
}
