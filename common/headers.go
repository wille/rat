package common

const (
	PingHeader         PacketHeader = 0
	ComputerInfoHeader PacketHeader = 5
	ScreenHeader       PacketHeader = 10
	ProcessHeader      PacketHeader = 11
	MonitorsHeader     PacketHeader = 12
	DirectoryHeader    PacketHeader = 13
	PutFileHeader      PacketHeader = 14 // Upload file to client
	GetFileHeader      PacketHeader = 15 // Download file from client
	MouseMoveHeader    PacketHeader = 16
)
