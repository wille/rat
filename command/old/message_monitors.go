package main

import (
	"rat/shared"
)

type MonitorMessage []shared.Monitor

func (m MonitorMessage) Header() MessageHeader {
	return MonitorQueryEvent
}
