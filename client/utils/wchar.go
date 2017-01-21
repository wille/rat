package utils

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
