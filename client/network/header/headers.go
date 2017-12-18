package header

// PacketHeader is the identifier for each packet
type PacketHeader uint16

const (
	PingHeader         PacketHeader = 0
	ComputerInfoHeader PacketHeader = 2
	ScreenHeader       PacketHeader = 3
	DirectoryHeader    PacketHeader = 4
	ProcessHeader      PacketHeader = 5
	MouseHeader        PacketHeader = 6
	MouseMoveHeader    PacketHeader = 7
	KeyHeader          PacketHeader = 8

	SysHeader     PacketHeader = 2
	PutFileHeader PacketHeader = 14 // Upload file to client
	GetFileHeader PacketHeader = 15 // Download file from client
	FileHeader    PacketHeader = 19
	ShellHeader   PacketHeader = 20
	WindowsHeader PacketHeader = 21
)
