package main

type ShellCommandMessage struct {
	Line string `json:"line"`
}

func (m ShellCommandMessage) Header() MessageHeader {
	return Shell
}
