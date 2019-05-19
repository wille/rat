package shared

type ShellAction int

const (
	ShellStart ShellAction = iota
	ShellStop
	ShellWrite
)
