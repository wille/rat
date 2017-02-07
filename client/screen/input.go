package screen

/*
#include "input.h"
*/
import "C"

func MoveCursor(m, x, y int) {
	C.MoveCursor(C.int(m), C.int(x), C.int(y))
}

func Mouse(m, button, t int) {
	C.Mouse(C.int(m), C.int(button), C.int(t))
}
