package shared

type Computer struct {
	Username            string
	Hostname            string
	HomeDir             string
	OperatingSystemType string
	OperatingSystem     string
}

func (ui *Computer) GetDisplayName() string {
	var display string

	if ui.OperatingSystemType == Windows {
		display = ui.Hostname + "\\" + ui.Username
	} else {
		display = ui.Username + "@" + ui.Hostname

	}

	return display
}
