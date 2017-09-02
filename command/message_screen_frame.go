package main

type ScreenFrameMessage struct {
	Frame string `json:"frame"`
}

func (m ScreenFrameMessage) Header() MessageHeader {
	return ScreenUpdateEvent
}
