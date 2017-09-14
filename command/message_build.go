package main

import (
	"rat/command/build"

	"golang.org/x/net/websocket"
)

type BuildMessage build.Config

func (m BuildMessage) Handle(ws *websocket.Conn, client *Client) error {
	cast := build.Config(m)
	path, name, err := build.Build(&cast)

	if err != nil {
		return err
	}

	tempKey := addDownload(TempFile{
		Path: path,
		Name: name,
	})

	return sendMessage(ws, client, DownloadQueryMessage{
		Key: tempKey,
	})
}
