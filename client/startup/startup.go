package startup

import "os"

func InstallCurrent(name string) error {
	return Install(name, os.Args[0])
}
