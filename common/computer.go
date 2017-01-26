package common

type Computer struct {
	Username            string
	Hostname            string
	HomeDir             string
	OperatingSystemType string
	OperatingSystem     string
}

func (ui *Computer) GetDisplayName() string {
	display := ui.Username + "@" + ui.Hostname

	return display
}
