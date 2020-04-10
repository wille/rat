package main

import (
	"bytes"
	"encoding/binary"
	"image"
	"io"
	"io/ioutil"
	"rat/internal/imgdiff"
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

	cmp := imgdiff.NewComparer()

	for err == nil {
		var x, y, x1, x2 int32

		binary.Read(channel, binary.LittleEndian, &x)
		binary.Read(channel, binary.LittleEndian, &y)
		binary.Read(channel, binary.LittleEndian, &x1)
		err = binary.Read(channel, binary.LittleEndian, &x2)
		if err != nil {
			break
		}

		var clen int32
		err = binary.Read(channel, binary.LittleEndian, &clen)

		if err != nil {
			break
		}

		compressed := make([]byte, clen)
		_, err = io.ReadFull(channel, compressed)
		if err != nil {
			break
		}

		ll := lz4.NewReader(bytes.NewBuffer(compressed))
		decompressed, err := ioutil.ReadAll(ll)

		if err != nil {
			break
		}

		// rect of changed values
		rect := image.Rect(int(x), int(y), int(x1), int(x2))
		chunk := cmp.Decode(&image.RGBA{
			Pix:    decompressed,
			Rect:   rect,
			Stride: rect.Dx() * 4,
		})

		var imgdata bytes.Buffer
		imgdata.Grow(rect.Dx() * rect.Dy() * 4)
		imgdiff.Write(&imgdata, chunk)

		sendMessage(sc.controller, c, ScreenChunkMessage{
			Buffer: imgdata.Bytes(),
			X:      int(x),
			Y:      int(y),
			Width:  int(x1),
			Height: int(x2),
		})
	}

	return err
}
