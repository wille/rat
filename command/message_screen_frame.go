package main

type ScreenFrameMessage string

func (m ScreenFrameMessage) Header() MessageHeader {
	return ScreenUpdateEvent
}
