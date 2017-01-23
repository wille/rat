package screen

/*
#include "screen.h"
*/
import "C"

type Monitor struct {
	id, x, y, width, height int
}

var (
	Monitors []Monitor
)

func init() {
	Monitors = make([]Monitor, 0)
}
