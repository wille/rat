package log

import (
	"fmt"
	"time"

	"github.com/fatih/color"
)

func printDateStamp() {
	date := time.Now().Format(time.ANSIC)

	color.Set(color.FgHiWhite)
	defer color.Unset()
	fmt.Printf("[%s] ", date)
}

func printColoredln(c color.Attribute, a ...interface{}) {
	printDateStamp()

	color.Set(c)
	defer color.Unset()
	fmt.Println(a...)
}

func Println(a ...interface{}) {
	printColoredln(color.FgWhite, a...)
}

func Greenln(a ...interface{}) {
	printColoredln(color.FgGreen, a...)
}

func Errorln(a ...interface{}) {
	printColoredln(color.FgRed, a...)
}

func Warnln(a ...interface{}) {
	printColoredln(color.FgYellow, a...)
}

func printColored(c color.Attribute, format string, a ...interface{}) {
	printDateStamp()

	color.Set(c)
	defer color.Unset()
	fmt.Printf(format, a...)
}

func Fprint(format string, a ...interface{}) {
	printColored(color.FgWhite, format, a...)
}

func Fgreen(format string, a ...interface{}) {
	printColored(color.FgGreen, format, a...)
}

func Ferror(format string, a ...interface{}) {
	printColored(color.FgRed, format, a...)
}

func Fwarn(format string, a ...interface{}) {
	printColored(color.FgYellow, format, a...)
}
