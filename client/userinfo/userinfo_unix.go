// +build !windows

package userinfo

import "os/user"

func GetUser() user.User {
	return user.Current()
}
