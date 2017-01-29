package screen

/*
#include "screen.h"
*/
import "C"

type Monitor struct {
	ID, X, Y, Width, Height int
}

var (
	Monitors []Monitor
)

func init() {
	Monitors = make([]Monitor, 0)
}
