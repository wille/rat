package main

import (
	"net/http"
	"rat/command/log"
	"reflect"
	"strconv"

	"golang.org/x/net/websocket"
)

// Event incoming message data
type Event struct {
	// Event code
	Event MessageHeader `json:"event"`

	// ClientID
	ClientID int `json:"id"`
}

var (
	WebSockets []*websocket.Conn
)

func init() {
	WebSockets = make([]*websocket.Conn, 0)
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

	err = websocket.JSON.Send(ws, message)
	return err
}

func readMessage(ws *websocket.Conn, s interface{}) error {
	err := websocket.JSON.Receive(ws, s)

	return err
}

func broadcast(message OutgoingMessage) {
	for _, ws := range WebSockets {
		sendMessage(ws, nil, message)
	}
}

func incomingWebSocket(ws *websocket.Conn) {
	WebSockets = append(WebSockets, ws)

	close := func() {
		ws.Close()

		for k, v := range WebSockets {
			if v == ws {
				WebSockets = append(WebSockets[:k], WebSockets[k+1:]...)
				break
			}
		}
	}
	defer close()

	disconnect := func(reason interface{}) {
		log.Ferror("%s: %s", ws.Request().RemoteAddr, reason)
	}

	var auth LoginMessage
	err := readMessage(ws, &auth)
	if err != nil {
		disconnect(err)
		return
	}

	authenticated := Authenticate(auth.Key)

	err = sendMessage(ws, nil, LoginResultMessage{authenticated})
	if err != nil {
		disconnect(err)
		return
	}

	if !authenticated {
		disconnect("authentication failure")
		return
	}

	log.Fgreen("%s: connected\n", ws.Request().RemoteAddr)

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
			disconnect(err)
			return
		}

		client := get(event.ClientID)

		if handler, ok := Messages[event.Event]; ok {
			log.Println(event)

			i := reflect.New(reflect.TypeOf(handler)).Interface()

			err = websocket.JSON.Receive(ws, &i)
			if err != nil {
				disconnect(err)
				return
			}

			err = i.(IncomingMessage).Handle(ws, client)

			if err != nil {
				disconnect(err)
				return
			}
		} else {
			disconnect("unknown message: " + strconv.Itoa(int(event.Event)))
		}
	}
}

/// InitControlSocket starts listening for incoming websocket connections
func InitControlSocket() {
	http.Handle("/control", websocket.Handler(incomingWebSocket))
}
