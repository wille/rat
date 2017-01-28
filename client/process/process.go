package process

type Process struct {
	Path string
	PID  int
}

var (
	Processes []Process
)
