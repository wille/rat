package main

type ScreenChunkMessage struct {
	Buffer       []byte
	X            int
	Y            int
	Width        int
	Height       int
	CursorX      int
	CursorY      int
	CursorWidth  int
	CursorHeight int
	CursorIcon   []byte
}

func (m ScreenChunkMessage) Header() MessageHeader {
	return ScreenEvent
}
