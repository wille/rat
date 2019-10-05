package main

import (
	"encoding/binary"
	"io"
	"os"
	"path/filepath"
	"rat/internal"
)

type T struct {
	Path string
	Err  error
	Len  int64
}

type ChannelQueryFiles struct{}

func (ChannelQueryFiles) Open(r io.ReadWriteCloser, c *Connection) error {
	var pathLen int32
	binary.Read(r, binary.LittleEndian, &pathLen)

	var paths []T
	for i := 0; i < int(pathLen); i++ {
		absPath, _ := shared.ReadString(r)

		stat, err := os.Stat(absPath)

		if stat.IsDir() {
			filepath.Walk(absPath, func(filepath string, fileInfo os.FileInfo, err error) error {
				if !fileInfo.IsDir() {
					paths = append(paths, T{Path: filepath, Err: err, Len: fileInfo.Size()})
				}
				return nil
			})
		} else {
			paths = append(paths, T{Path: absPath, Err: err, Len: stat.Size()})
		}
	}

	binary.Write(r, binary.LittleEndian, int32(len(paths)))
	for _, p := range paths {
		shared.WriteString(r, p.Path)
		binary.Write(r, binary.LittleEndian, p.Len)
		if p.Err != nil {
			shared.WriteString(r, p.Err.Error())
		} else {
			shared.WriteString(r, "")
		}
	}

	return nil
}
