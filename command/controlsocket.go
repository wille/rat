package main

import (
	"fmt"
	"net/http"
	"time"

	"golang.org/x/net/websocket"
)

const (
	ScreenUpdateEvent = 0
)

type Event struct {
	Event    int
	ClientId int
	Data     string
}

func newEvent(event int, clientID int, data string) *Event {
	return &Event{event, clientID, data}
}

func incomingWebSocket(ws *websocket.Conn) {
	defer func() {
		ws.Close()
	}()

	for {
		var event Event
		err := websocket.JSON.Receive(ws, &event)

		if err != nil {
			fmt.Println(err)
			return
		}

		client := get(event.ClientId)

		if event.Event == ScreenUpdateEvent {
			go func() {
				for {
					event := newEvent(ScreenUpdateEvent, client.Id, client.GetEncodedScreen())

					err := websocket.JSON.Send(ws, &event)

					if err != nil {
						fmt.Println(err.Error())
						return
					}
					time.Sleep(time.Millisecond * 200)
				}
			}()
		}
	}
}

func InitControlSocket() {
	http.Handle("/control", websocket.Handler(incomingWebSocket))
}
