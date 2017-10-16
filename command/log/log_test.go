package log

import (
	"testing"
)

func TestColors(t *testing.T) {
	Println("Normal line")
	Greenln("Green line")
	Errorln("Error line")
	Warnln("Warn line")
}
