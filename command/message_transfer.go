package main

import "fmt"

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

			t := NewDownload(r.Path, r.Size)
			t.Start(client)
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
