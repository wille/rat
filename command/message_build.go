package main

import (
	"encoding/json"
	"rat/command/build"

	"golang.org/x/net/websocket"
)

type BuildMessage Message

func (d BuildMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	var config build.Config
	json.Unmarshal([]byte(data), &config)

	path, name, err := build.Build(&config)

	if err != nil {
		return err
	}

	tempKey := addDownload(TempFile{
		Path: path,
		Name: name,
	})

	event := newEvent(DownloadQueryEvent, 0, string(tempKey))
	err = websocket.JSON.Send(ws, &event)

	return err
}
