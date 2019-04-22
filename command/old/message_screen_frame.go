package main

type ScreenFrameMessage struct {
	Buffer []byte
	Width  int
	Height int
}

func (m ScreenFrameMessage) Header() MessageHeader {
	return ScreenUpdateEvent
}
