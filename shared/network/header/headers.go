package header

// PacketHeader is the identifier for each packet
type PacketHeader uint16

const (
	PingHeader             PacketHeader = 0
	ComputerInfoHeader     PacketHeader = 2
	ScreenHeader           PacketHeader = 3
	DirectoryHeader        PacketHeader = 4
	ProcessHeader          PacketHeader = 5
	MouseHeader            PacketHeader = 6
	MouseMoveHeader        PacketHeader = 7
	KeyHeader              PacketHeader = 8
	DownloadToServerHeader PacketHeader = 10 // Download file from client
	UploadToClientHeader   PacketHeader = 12 // Upload file to client

	SysHeader     PacketHeader = 2
	FileHeader    PacketHeader = 19
	ShellHeader   PacketHeader = 20
	WindowsHeader PacketHeader = 21
)
