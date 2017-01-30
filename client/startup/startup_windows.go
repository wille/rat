package startup

/*
#include "startup_windows.h"
*/
import "C"

func Install(name, path string) error {
	C.Install(C.CString(name), C.CString(path))

	return nil
}
