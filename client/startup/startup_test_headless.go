//+build headless,!windows,!darwin

package startup

var ctr = 0

func Check(name string) bool {
	ctr++
	return ctr == 1
}
