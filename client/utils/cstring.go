package utils

import (
	"strings"
)

func TrimCStr(s string) string {
	if strings.Contains(s, "\x00") {
		return s[:strings.Index(s, "\x00")]
	}

	return s
}
