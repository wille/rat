package main

type UpdateType int

const (
	// Add a client
	Add UpdateType = iota

	// Update a clients information
	Update

	// Remove a client (disconnect)
	Remove
)

type ClientMessage struct {
	Type UpdateType  `json:"type"`
	ID   int         `json:"id"`
	Data interface{} `json:"data,omitempty"`
}

func (m ClientMessage) Header() MessageHeader {
	return ClientUpdateEvent
}

type ClientData struct {
	Ping            int    `json:"ping"`
	Country         string `json:"country,omitempty"`
	Flag            string `json:"flag,omitempty"`
	Host            string `json:"host,omitempty"`
	ComputerName    string `json:"computerName,omitempty"`
	OperatingSystem string `json:"operatingSystem,omitempty"`
}

func NewClientEvent(t UpdateType, client *Client, data interface{}) ClientMessage {
	return ClientMessage{t, client.Id, data}
}
