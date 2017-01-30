//+build !windows

package computer

import (
	"fmt"
	"os"
	"os/user"
	"rat/common"
)

func GetComputerInformation() common.Computer {
	u, err := user.Current()

	if err != nil {
		fmt.Println(err.Error())
	}

	info := common.Computer{}

	info.Username = u.Username
	info.HomeDir = u.HomeDir

	hostname, err := os.Hostname()

	if err != nil {
		fmt.Println(err.Error())
	}

	info.Hostname = hostname

	return info
}
