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

type ConnectClientData struct {
	Ping int `json:"ping"`
}

type DisconnectClientData struct {
}

func NewClientEvent(t UpdateType, client *Client, data interface{}) ClientEvent {
	return ClientEvent{t, client.Id, data}
}
