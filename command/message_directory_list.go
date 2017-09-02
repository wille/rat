package main

type DirectoryListMessage struct {
	Files []File `json:"files"`
}

func (m DirectoryListMessage) Header() MessageHeader {
	return DirectoryQueryEvent
}
