package main

type UpdateType int

const (
	Add UpdateType = iota
	Update
	Remove
)

type ClientEvent struct {
	Type UpdateType  `json:"type"`
	ID   int         `json:"id"`
	Data interface{} `json:"data,omitempty"`
}

type ClientData struct {
	Ping            int    `json:"ping"`
	Country         string `json:"country,omitempty"`
	Flag            string `json:"flag,omitempty"`
	Host            string `json:"host,omitempty"`
	ComputerName    string `json:"computerName,omitempty"`
	OperatingSystem string `json:"operatingSystem,omitempty"`
}

func NewClientEvent(t UpdateType, client *Client, data interface{}) ClientEvent {
	return ClientEvent{t, client.Id, data}
}
