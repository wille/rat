package main

import (
	"encoding/binary"
	"io"
	"rat/shared"
	"rat/shared/network/header"
)

type File struct {
	Dir  bool
	Path string
	Size int64
	Time int64
}

type ChannelQueryDirectory struct {
	Path       string
	controller *Controller
}

func (ChannelQueryDirectory) Header() header.PacketHeader {
	return header.DirectoryHeader
}

func (ch ChannelQueryDirectory) Open(r io.ReadWriteCloser, c *Client) error {
	shared.WriteString(r, ch.Path)

	var len int32
	if err := binary.Read(r, binary.LittleEndian, &len); err != nil {
		return err
	}

	files := make([]File, len)
	for i := 0; i < int(len); i++ {
		f := &files[i]

		binary.Read(r, binary.LittleEndian, &f.Dir)
		basename, _ := shared.ReadString(r)

		f.Path = ch.Path + c.GetPathSep() + basename

		binary.Read(r, binary.LittleEndian, &f.Time)
		if err := binary.Read(r, binary.LittleEndian, &f.Size); err != nil {
			return err
		}
	}

	sendMessage(ch.controller, c, DirectoryListMessage(files))

	return nil
}
