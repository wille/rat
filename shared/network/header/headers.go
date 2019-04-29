package header

// PacketHeader is the identifier for each packet
type PacketHeader uint16

const (
	PingHeader         PacketHeader = 0
	ChannelImplHeader  PacketHeader = 1
	ComputerInfoHeader PacketHeader = 2
	ShellChannelHeader PacketHeader = 20

	ScreenHeader           PacketHeader = 4
	DirectoryHeader        PacketHeader = 3 // swapped
	ProcessHeader          PacketHeader = 5
	DownloadToServerHeader PacketHeader = 10 // Download file from client
	UploadToClientHeader   PacketHeader = 12 // Upload file to client

	MouseHeader     PacketHeader = 41
	MouseMoveHeader PacketHeader = 42
	KeyHeader       PacketHeader = 43

	SysHeader     PacketHeader = 2
	FileHeader    PacketHeader = 19
	WindowsHeader PacketHeader = 21
)
