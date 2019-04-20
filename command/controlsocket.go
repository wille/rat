package main

import (
	"fmt"
	"net/http"
	"rat/command/log"
	"reflect"

	"golang.org/x/net/websocket"
	"gopkg.in/mgo.v2/bson"
)

// Event incoming message data
type Event struct {
	// Event code
	Event int `bson:"eventId" json:"eventId"`

	// ClientID
	ClientID int `bson:"clientId" json:"clientId"`
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

	asdf := struct {
		Id   int
		Type MessageHeader
		Data interface{}
	}{
		Id:   id,
		Type: message.Header(),
		Data: message,
	}

	b, err := bson.Marshal(asdf)
	err = websocket.Message.Send(ws, b)
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
	/*
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
		} */

	log.Fgreen("%s: connected\n", ws.Request().RemoteAddr)

	if len(DisplayTransfers) > 0 {
		sendMessage(ws, nil, DisplayTransferMessage{
			DisplayTransfers,
		})
	}

	updateAll()

	for {
		var bbb []byte
		err := websocket.Message.Receive(ws, &bbb)
		var event Event
		bson.Unmarshal(bbb, &event)

		if err != nil {
			disconnect(err)
			return
		}

		client := get(event.ClientID)

		if handler, ok := Messages[MessageHeader(event.Event)]; ok {
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
			fmt.Println("missing", event.Event)
		}
	}
}

/// InitControlSocket starts listening for incoming websocket connections
func InitControlSocket() {
	http.Handle("/control", websocket.Handler(incomingWebSocket))
}
