package system

type Action int

const (
	Disconnect Action = iota
	Shutdown
	Reboot
	Uninstall
)
