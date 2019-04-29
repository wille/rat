package main

type ShellCommandMessage struct {
	Line string `json:"line"`
}

func (ShellCommandMessage) Header() MessageHeader {
	return ShellEvent
}
