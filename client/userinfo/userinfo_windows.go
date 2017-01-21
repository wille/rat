package userinfo

/*
#include <windows.h>
*/
import "C"

import (
	"os/user"
	"unsafe"
)

func GetUser() user.User {
	u := user.User{}

	const BufferSize = 100

	lpBuffer := make([]byte, BufferSize)
	var lpnSize C.DWORD = BufferSize

	ptr := unsafe.Pointer(&lpBuffer[0])

	C.GetComputerName((*C.CHAR)(ptr), &lpnSize)

	u.Username = string(lpBuffer)

	return u
}
