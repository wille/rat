package main

import (
	"fmt"
	"net/http"
	"reflect"

	"golang.org/x/net/websocket"
)

// Event incoming message data
type Event struct {
	// Event code
	Event MessageHeader `json:"event"`

	// ClientID
	ClientID int `json:"id"`
}

func sendMessage(ws *websocket.Conn, c *Client, message OutgoingMessage) error {
	id := 0

	if c != nil {
		id = c.Id
	}

	event := Event{message.Header(), id}

	err := websocket.JSON.Send(ws, &event)
	if err != nil {
		return err
	}

	err = websocket.JSON.Send(ws, &message)
	return err
}

func readMessage(ws *websocket.Conn, s interface{}) error {
	err := websocket.JSON.Receive(ws, s)

	return err
}

var globalws *websocket.Conn

func incomingWebSocket(ws *websocket.Conn) {
	globalws = ws

	defer func() {
		ws.Close()
	}()

	var auth LoginMessage
	err := readMessage(ws, &auth)
	if err != nil {
		fmt.Println("error while authenticating", err.Error())
		return
	}
	fmt.Println("client login with:", auth)

	authenticated := Authenticate(auth.Key)

	err = sendMessage(ws, nil, LoginResultMessage{authenticated})
	if err != nil {
		fmt.Println("auth", err.Error())
		return
	}

	if !authenticated {
		fmt.Println("Not authenticated!")
		return
	}

	fmt.Println("authenticated with key", auth.Key)

	if len(DisplayTransfers) > 0 {
		sendMessage(ws, nil, DisplayTransferMessage{
			DisplayTransfers,
		})
	}

	updateAll()
	for {
		var event Event
		err := websocket.JSON.Receive(ws, &event)

		if err != nil {
			fmt.Println(err)
			return
		}

		client := get(event.ClientID)

		if handler, ok := Messages[event.Event]; ok {
			fmt.Println(event)

			i := reflect.New(reflect.TypeOf(handler)).Interface()

			err = websocket.JSON.Receive(ws, &i)
			if err != nil {
				fmt.Println("failed decode", err.Error())
			}

			err = i.(IncomingMessage).Handle(ws, client, "")

			if err != nil {
				fmt.Println("websocket message:", err.Error())
			}
		} else {
			fmt.Println("Unknown message:", event.Event)
		}
	}
}

/// InitControlSocket starts listening for incoming websocket connections
func InitControlSocket() {
	http.Handle("/control", websocket.Handler(incomingWebSocket))
}
