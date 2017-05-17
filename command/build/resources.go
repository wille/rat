package build

import (
	"os/exec"
)

type optionpair struct {
	option string
	value  string
}

const (
	ProductVersion = "--set-product-version"
	FileVersion    = "--set-file-version"
	Icon           = "--set-icon"
)

func AddResources(path string, data []optionpair) {
	cmdline := []string{path}

	for _, v := range data {
		cmdline = append(cmdline, v.option, v.value)
	}

	exec.Command("rcedit", cmdline...)
}
