package main

import "fmt"

type ScreenMessage struct {
	Active  bool
	Scale   float32
	Monitor bool
	Handle_ int32
}

func (m ScreenMessage) Handle(controller *Controller, client *Client) error {
	client.streamChan <- &ScreenChannel{
		controller: controller,
		Monitor:    m.Monitor,
		Handle:     m.Handle_,
	}

	fmt.Println(m)

	return nil
}
