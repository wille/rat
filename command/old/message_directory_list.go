package main

type DirectoryListMessage []File

func (m DirectoryListMessage) Header() MessageHeader {
	return DirectoryQueryEvent
}
