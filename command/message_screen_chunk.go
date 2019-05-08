package main

type ScreenChunkMessage struct {
	Buffer []byte
	X      int
	Y      int
	Width  int
	Height int
}

func (m ScreenChunkMessage) Header() MessageHeader {
	return ScreenEvent
}
