package header

// PacketHeader is the identifier for each packet
type PacketHeader uint16

const (
	PingHeader         PacketHeader = 0
	ComputerInfoHeader PacketHeader = 2
	ScreenHeader       PacketHeader = 3
	DirectoryHeader    PacketHeader = 4

	SysHeader       PacketHeader = 2
	ProcessHeader   PacketHeader = 11
	PutFileHeader   PacketHeader = 14 // Upload file to client
	GetFileHeader   PacketHeader = 15 // Download file from client
	MouseMoveHeader PacketHeader = 16
	MouseHeader     PacketHeader = 17
	KeyHeader       PacketHeader = 18
	FileHeader      PacketHeader = 19
	ShellHeader     PacketHeader = 20
	WindowsHeader   PacketHeader = 21
)
