package main

type ScreenMessage struct {
	Active  bool
	Scale   float32
	Monitor bool
	Handle_ int
}

func (m ScreenMessage) Handle(controller *Controller, client *Client) error {
	client.streamChan <- ScreenChannel{controller}

	return nil
}
