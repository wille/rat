//+build headless,!windows,!darwin

package startup

func Check(name string) bool {
	return true
}
