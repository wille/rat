package main

import (
	"fmt"
	"net/http"

	"encoding/json"

	"golang.org/x/net/websocket"
)

const (
	ClientUpdateEvent           = 1
	ClientSysEvent              = 2
	DirectoryQueryEvent         = 3
	DownloadQueryEvent          = 4
	TransfersEvent              = 5
	DownloadProgressUpdateEvent = 6
	ScreenUpdateEvent           = 7
	ProcessQueryEvent           = 8
	MonitorQueryEvent           = 9
	MouseMove                   = 10
	Mouse                       = 11
	Key                         = 12
	Build                       = 13
	Shell                       = 14
	ModifyFileEvent             = 15
	Exit                        = 16
	AuthenticationEvent         = 17
	Windows                     = 18
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
	Messages[ClientSysEvent] = SysMessage{}
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
	Messages[Exit] = ExitMessage{}
	//Messages[Windows] = WindowMessage{}
}

func newEvent(event int, clientID int, data string) *Event {
	return &Event{event, clientID, data}
}

var globalws *websocket.Conn

func incomingWebSocket(ws *websocket.Conn) {
	defer func() {
		ws.Close()
	}()

	var auth LoginMessage
	err := websocket.JSON.Receive(ws, &auth)
	if err != nil {
		fmt.Println("error while authenticating", err.Error())
		return
	}
	fmt.Println("client login with:", auth)

	authenticated := Authenticate(auth.Key)

	result, err := json.Marshal(LoginResultMessage{authenticated})
	if err != nil {
		fmt.Println("auth", err.Error())
		return
	}
	event := newEvent(AuthenticationEvent, 0, string(result))
	websocket.JSON.Send(ws, &event)

	if !authenticated {
		fmt.Println("Not authenticated!")
		return
	}

	fmt.Println("authenticated with key", auth.Key)

	transfers, err := json.Marshal(&DisplayTransfers)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	stransfers := string(transfers)
	if stransfers != "null" {
		event = newEvent(TransfersEvent, 0, string(transfers))
		websocket.JSON.Send(ws, &event)
	}

	globalws = ws

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
