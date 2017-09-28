//+build headless,!windows,!darwin

package startup

func Install(name, path string) error {
	return nil
}

func Uninstall(name string) {

}
