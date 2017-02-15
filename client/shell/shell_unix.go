//+build !windows

package shell

import "os"

func GetDefault() string {
	shell := os.Getenv("SHELL")

	if shell == "" {
		shell = "/bin/sh"
	}

	return shell
}
