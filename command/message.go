package main

type MessageHeader int

const (
	ShellEvent MessageHeader = 5

	DirectoryQueryEvent MessageHeader = 3
	ScreenUpdateEvent   MessageHeader = 4
	ProcessQueryEvent   MessageHeader = 8

	Mouse     MessageHeader = 41
	MouseMove MessageHeader = 42
	Key       MessageHeader = 43

	DownloadQueryHeader MessageHeader = 10

	ClientUpdateEvent           MessageHeader = 1
	ClientSysEvent              MessageHeader = 2
	TransfersEvent              MessageHeader = 5
	DownloadProgressUpdateEvent MessageHeader = 6
	MonitorQueryEvent           MessageHeader = 9
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
	Handle(*Controller, *Client) error
}

// MessageMap is a map with event handlers and their codes
type MessageMap map[MessageHeader]IncomingMessage

// Messages contains all incoming messages mapped with their codes
var Messages MessageMap

func init() {
	Messages = make(MessageMap)
	Messages[ShellEvent] = ShellMessage{}
	/* Messages[TransfersEvent] = DisplayTransferMessage{}
	Messages[ClientSysEvent] = SysMessage{}
	Messages[MouseMove] = MouseMoveMessage{}
	Messages[DownloadQueryHeader] = DownloadMessage{}
	Messages[DirectoryQueryEvent] = DirectoryRequestMessage{}
	Messages[ProcessQueryEvent] = ProcessQueryMessage{}
	Messages[ScreenUpdateEvent] = ScreenUpdateMessage{}
	Messages[Mouse] = MouseMessage{}
	Messages[Key] = KeyMessage{}
	Messages[Build] = BuildMessage{} */
	/* 	Messages[Shell] = ShellMessage{}
	   	Messages[ModifyFileEvent] = FileMessage{}
	   	Messages[Exit] = ExitMessage{}
	   	Messages[Windows] = WindowMessage{} */
}
