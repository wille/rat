package main

import (
	"golang.org/x/net/websocket"
)

type MessageHeader int

const (
	ClientUpdateEvent           MessageHeader = 1
	ClientSysEvent              MessageHeader = 2
	DirectoryQueryEvent         MessageHeader = 3
	DownloadQueryHeader         MessageHeader = 4
	TransfersEvent              MessageHeader = 5
	DownloadProgressUpdateEvent MessageHeader = 6
	ScreenUpdateEvent           MessageHeader = 7
	ProcessQueryEvent           MessageHeader = 8
	MonitorQueryEvent           MessageHeader = 9
	MouseMove                   MessageHeader = 10
	Mouse                       MessageHeader = 11
	Key                         MessageHeader = 12
	Build                       MessageHeader = 13
	Shell                       MessageHeader = 14
	ModifyFileEvent             MessageHeader = 15
	Exit                        MessageHeader = 16
	AuthenticationEvent         MessageHeader = 17
	Windows                     MessageHeader = 18
)

type OutgoingMessage interface {
	Header() MessageHeader
}

type IncomingMessage interface {
	Handle(ws *websocket.Conn, client *Client) error
}

// MessageMap is a map with event handlers and their codes
type MessageMap map[MessageHeader]IncomingMessage

// Messages contains all incoming messages mapped with their codes
var Messages MessageMap

func init() {
	Messages = make(MessageMap)
	Messages[TransfersEvent] = DisplayTransferMessage{}
	Messages[ClientSysEvent] = SysMessage{}
	Messages[MouseMove] = MouseMoveMessage{}
	Messages[DownloadQueryHeader] = DownloadMessage{}
	Messages[DirectoryQueryEvent] = DirectoryRequestMessage{}
	Messages[ProcessQueryEvent] = ProcessQueryMessage{}
	Messages[ScreenUpdateEvent] = ScreenUpdateMessage{}
	Messages[Mouse] = MouseMessage{}
	Messages[Key] = KeyMessage{}
	Messages[Build] = BuildMessage{}
	Messages[Shell] = ShellMessage{}
	Messages[ModifyFileEvent] = FileMessage{}
	Messages[Exit] = ExitMessage{}
	Messages[Windows] = WindowMessage{}
}
