package main

type ScreenMessage struct {
	Active  bool
	Scale   float32
	Monitor bool
	ID      int32
}

func (m ScreenMessage) Handle(controller *Controller, client *Client) error {
	if m.Active {
		client.streamChan <- &ScreenChannel{
			controller: controller,
			Monitor:    m.Monitor,
			ID:         m.ID,
		}
	}
	return nil
}
