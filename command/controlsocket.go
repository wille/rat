package main

import (
	"bufio"
	"fmt"
	"net/http"
	"strconv"
	"strings"
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

	reader := bufio.NewReader(ws)
	sid, _ := reader.ReadString('\n')

	id, _ := strconv.Atoi(strings.Trim(sid, "\n"))
	client := get(id)
	fmt.Println("id:", id)

	go func() {
		if client != nil {
			for {
				event := newEvent(ScreenUpdateEvent, id, client.GetEncodedScreen())

				websocket.JSON.Send(ws, &event)
				time.Sleep(time.Second)
			}
		}
	}()

	for {
		var event Event
		err := websocket.JSON.Receive(ws, &event)

		if err != nil {
			fmt.Println(err)
			return
		}

		client := get(event.ClientId)
		fmt.Println("rid:", client.Id)
	}
}

func InitControlSocket() {
	http.Handle("/control", websocket.Handler(incomingWebSocket))
}
