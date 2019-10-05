//+build !headless

package startup

/*
#include "startup_test_windows.h"
*/
import "C"

func Check(name string) bool {
	d := C.CheckRegistry(C.CString(name))
	return bool(d)
}
