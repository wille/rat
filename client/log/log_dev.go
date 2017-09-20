//+build !prod

package log

import (
	"fmt"
	"os"
)

// Errorln prints to stderr
func Errorln(format string, a ...interface{}) {
	fmt.Fprintf(os.Stderr, format, a)
	fmt.Fprintf(os.Stderr, "\n")
}

// Printf fmt.Printf() wrapper
func Printf(format string, a ...interface{}) {
	fmt.Printf(format, a...)
	fmt.Println()
}

// Println fmt.Println() wrapper
func Println(a ...interface{}) {
	fmt.Println(a...)
}
