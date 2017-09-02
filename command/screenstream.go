package main

import (
	"fmt"
	"time"

	"golang.org/x/net/websocket"
)

// ScreenStream streams screen to websocket
func ScreenStream(client *Client, ws *websocket.Conn) {
	for client.Screen.Streaming {
		if !client.Screen.New {
			time.Sleep(time.Millisecond)
			continue
		}

		client.Screen.New = false

		err := sendMessage(ws, client, ScreenFrameMessage{client.GetEncodedScreen()})

		if err != nil {
			fmt.Println("screenstream:", err.Error())
			return
		}
	}
}
