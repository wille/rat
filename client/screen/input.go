package screen

/*
#include "input.h"
*/
import "C"

func MoveCursor(m, x, y int) {
	C.MoveCursor(C.int(m), C.int(x), C.int(y))
}
