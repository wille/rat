package main

import (
	"rat/shared"
)

type MonitorMessage struct {
	Monitors []shared.Monitor `json:"monitors"`
}

func (m MonitorMessage) Header() MessageHeader {
	return MonitorQueryEvent
}
