//+build prod

package log

// Errorln does nothing in production
func Errorln(format string, a ...interface{}) {

}

// Printf does nothing in production
func Printf(format string, a ...interface{}) {

}

// Println does nothing in production
func Println(a ...interface{}) {

}
