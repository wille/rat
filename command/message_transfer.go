package main

import (
	"fmt"
	"path/filepath"
	"time"
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

type UploadMessage struct {
	Name string
	Dest string
	Size int64
	Data []byte
}

func (upload UploadMessage) Handle(controller *Controller, client *Client) error {
	listener := controller.Listen(UploadToClient, client)

	fmt.Println("Uploading", upload)

	t := NewTransfer(filepath.Join(upload.Dest, upload.Name), upload.Size, false)

	err := t.Open(true)

	go func() {
		defer listener.Unlisten()
		defer t.Close()
		var recv int64

		for {
			select {
			case <-time.After(time.Second * 10):
				fmt.Println("timeout")
				return
			case <-controller.die:
				fmt.Println("controller die")
				return
			case <-client.die:
				fmt.Println("client die")
				return
			case msgi := <-listener.C:
				if msgi != nil {
					fmt.Println(msgi)
					msg := msgi.(*UploadMessage)
					t.Write(msg.Data)
					recv += int64(len(msg.Data))

					if recv >= upload.Size {
						fmt.Println("starting upload to client")
						t.Close()
						t.Offset = 0
						t.Start(client)
						return
					}
				} else {
					fmt.Println("is nul")
					return
				}
			}
		}
	}()

	return err
}
