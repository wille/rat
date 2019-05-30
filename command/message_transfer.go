package main

import (
	"fmt"
	"os"
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

type UploadMessage struct {
	Name string
	Dest string
	Size int64
	Data []byte
}

func (upload UploadMessage) Handle(controller *Controller, client *Client) error {
	listener := controller.Listen(UploadToClient, client)

	fmt.Println("Uploading", upload)

	t := NewUpload(filepath.Join(upload.Dest, upload.Name), upload.Size)

	fp, _ := os.Create(t.Local)

	go func() {
		defer listener.Unlisten()
		defer fp.Sync()
		defer fp.Close()
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
					fp.Write(msg.Data)
					recv += int64(len(msg.Data))

					if recv >= upload.Size {
						fmt.Println("starting upload to client")
						fp.Sync()
						fp.Close()
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

	return nil
}
