package main

import (
	"rat/shared/network/header"

	humanize "github.com/dustin/go-humanize"
)

type FileData struct {
	Dir    bool
	Name   string
	Edited string
	Size   int64
}

type DirectoryPacket struct {
	Path  string     `network:"send,receive"`
	Files []FileData `network:"receive"`
}

func (packet DirectoryPacket) Header() header.PacketHeader {
	return header.DirectoryHeader
}

func (packet DirectoryPacket) Init(c *Client) {

}

type File struct {
	Dir  bool   `json:"directory"`
	Path string `json:"path"`
	Size string `json:"size"`
	Time string `json:"time"`
}

func (packet DirectoryPacket) OnReceive(c *Client) error {
	dirs := make([]File, 0)
	files := make([]File, 0)

	for _, file := range packet.Files {
		file := File{file.Dir, file.Name, humanize.Bytes(uint64(file.Size)), file.Edited}

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
