package main

// LoginMessage is always received upon websocket connection, no handler needed
type LoginMessage struct {
	Key string `json:"key"`
}

// LoginResultMessage is sent to indicate if the login attempt was successful or not
type LoginResultMessage struct {
	Result bool `json:"result"`
}

func (m LoginResultMessage) Header() MessageHeader {
	return AuthenticationEvent
}
