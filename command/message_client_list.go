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
	Type UpdateType  `bson:"type"`
	ID   int         `bson:"id"`
	Data interface{} `bson:"data,omitempty"`
}

func (m ClientMessage) Header() MessageHeader {
	return ClientUpdateEvent
}

type OperatingSystem struct {
	Type    string `bson:"type"`
	Display string `bson:"display"`
}

type ClientData struct {
	Ping            int    `bson:"ping"`
	Country         string `bson:"country,omitempty"`
	Flag            string `bson:"flag,omitempty"`
	Host            string `bson:"host,omitempty"`
	Hostname        string `bson:"hostname,omitempty"`
	Username        string `bson:"username,omitempty"`
	OperatingSystem `bson:"os,omitempty"`
}

func NewClientEvent(t UpdateType, client *Client, data interface{}) ClientMessage {
	return ClientMessage{t, client.Id, data}
}
