// +build !windows

package userinfo

import "os/user"

func GetComputerInformation() common.Computer {
	u := user.Current()

	return common.Computer{
		Username: u.Username,
		Hostname: "",
		HomeDir: u.HomeDir
	}
}
