package main

type DirectoryListMessage []File

func (m DirectoryListMessage) Header() MessageHeader {
	return DirectoryQueryEvent
}

type DirectoryQueryMessage string

func (m DirectoryQueryMessage) Handle(controller *Controller, client *Client) error {
	client.streamChan <- ChannelQueryDirectory{
		controller: controller,
		Path:       string(m),
	}
	return nil
}
