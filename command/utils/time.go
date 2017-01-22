package utils

import "time"

func GetMilliseconds(t time.Time) int64 {
	return t.UnixNano() / time.Millisecond.Nanoseconds()
}
