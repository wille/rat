package main

const (
	IconPath = "static/images/"
)

func GetOperatingSystemIcon(os string) string {
	var icon string

	switch os {
	case Windows:
		icon = "os_windows.png"
	case Linux:
		icon = "os_linux.png"
	case MacOS:
		icon = "os_macos.png"
	default:
		icon = "os_unknown.png"
	}

	return IconPath + "os/" + icon
}
