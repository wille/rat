package main

import (
	"fmt"
	"net/http"

	"encoding/json"

	"golang.org/x/net/websocket"
)

const (
	ScreenUpdateEvent           = 0
	ProcessQueryEvent           = 1
	MonitorQueryEvent           = 2
	DirectoryQueryEvent         = 3
	DownloadQueryEvent          = 4
	TransfersEvent              = 5
	DownloadProgressUpdateEvent = 6
	MouseMove                   = 10
	Mouse                       = 11
	Key                         = 12
	Build                       = 13
	Shell                       = 14
	ModifyFileEvent             = 15
)

// Event incoming message data
type Event struct {
	// Event code
	Event int `json:"event"`

	// ClientID
	ClientID int `json:"id"`

	// Data is the event data (might be JSON)
	Data string `json:"data"`
}

// EventHandler handles incoming websocket message
type EventHandler interface {
	Handle(ws *websocket.Conn, client *Client, data string) error
}

// Message empty message struct
type Message struct {
}

// MessageMap is a map with event handlers and their codes
type MessageMap map[int]EventHandler

// Messages contains all incoming messages mapped with their codes
var Messages MessageMap

func init() {
	Messages = make(MessageMap)
	Messages[TransfersEvent] = DisplayTransferEvent{}
	Messages[MouseMove] = MouseMoveMessage{}
	Messages[DownloadQueryEvent] = DownloadMessage{}
	Messages[DirectoryQueryEvent] = DirectoryRequestMessage{}
	Messages[ProcessQueryEvent] = ProcessQueryMessage{}
	Messages[ScreenUpdateEvent] = ScreenUpdateMessage{}
	Messages[Mouse] = MouseMessage{}
	Messages[Key] = KeyMessage{}
	Messages[Build] = BuildMessage{}
	Messages[Shell] = ShellMessage{}
	Messages[ModifyFileEvent] = FileMessage{}
}

func newEvent(event int, clientID int, data string) *Event {
	return &Event{event, clientID, data}
}

func incomingWebSocket(ws *websocket.Conn) {
	defer func() {
		ws.Close()
	}()

	transfers, err := json.Marshal(&DisplayTransfers)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	event := newEvent(TransfersEvent, 0, string(transfers))
	websocket.JSON.Send(ws, &event)

	for {
		var event Event
		err := websocket.JSON.Receive(ws, &event)

		if err != nil {
			fmt.Println(err)
			return
		}

		client := get(event.ClientID)

		if handler, ok := Messages[event.Event]; ok {
			err = handler.Handle(ws, client, event.Data)
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
