package main

import (
	"fmt"
	"path/filepath"
)

type Req struct {
	Path string
	Dir  bool
	Size int64
}

type TransferMessage struct {
	Paths []Req
}

func (m TransferMessage) Handle(controller *Controller, client *Client) error {
	directories := make([]string, 0)

	// resolve directories, initiate transfers for absolute files
	for _, r := range m.Paths {
		if r.Dir {
			directories = append(directories, r.Path)
		} else {
			fmt.Println("Download", r)

			t := NewTransfer(r.Path, r.Size, true)
			t.Start(client, nil)
		}
	}

	if len(directories) > 0 {
		fmt.Println("Querying", directories)

		client.streamChan <- ChannelQueryFiles{
			Paths: directories,
		}
	}

	return nil
}

type UploadMessage struct {
	Name string
	Dest string
	Size int64
	Data []byte
}

func (upload UploadMessage) Handle(controller *Controller, client *Client) error {
	t := NewTransfer(filepath.Join(upload.Dest, upload.Name), upload.Size, false)
	t.Start(client, controller)

	return nil
}
