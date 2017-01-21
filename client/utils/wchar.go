package utils

/*
#include <wchar.h>
*/
import "C"

import (
	"unsafe"
)

// WideChar is 16-bit Unicode character
// WINAPI: unsigned short
// wchar_t
type WideChar uint16

func GetWideString(k []WideChar, len int) string {
	var s string

	for i := 0; i < len; i++ {
		s += string(rune(k[i]))
	}

	return s
}

// GetLength returns the length of a wide string using wcslen()
func GetLength(k []WideChar) int {
	ptr := unsafe.Pointer(&k[0])
	len := C.wcslen((*C.wchar_t)(ptr))

	return int(len)
}
