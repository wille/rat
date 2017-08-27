package utils

/*
#include <wchar.h>
*/
import "C"

import (
	"unicode/utf16"
	"unsafe"
)

// Wchar is 16-bit Unicode character
// WINAPI: unsigned short
// wchar_t
type Wchar uint16

func GetWideString(k []Wchar, len int) string {
	var s string

	for i := 0; i < len; i++ {
		s += string(rune(k[i]))
	}

	return s
}

// GetLength returns the length of a wide string using wcslen()
func GetLength(k []Wchar) int {
	ptr := unsafe.Pointer(&k[0])
	len := C.wcslen((*C.wchar_t)(ptr))

	return int(len)
}

// Convert wide character pointer to Go string
// https://groups.google.com/forum/#!topic/golang-nuts/8sc2vjth30o
func WcharToString(wc *uint16, wcMax int) string {
	const max = 0xffff
	if wcMax < 0 || wcMax > max {
		wcMax = max
	}
	p := (*[max]uint16)(unsafe.Pointer(wc))
	s := p[:wcMax]
	for i, v := range s {
		if v == 0 {
			s = s[0:i]
			break
		}
	}
	return string(utf16.Decode(s))
}
