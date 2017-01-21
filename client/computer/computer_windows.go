package userinfo

/*
#include <windows.h>
*/
import "C"

import (
	"rat/client/utils"
	"rat/common"
	"unsafe"
)

func GetUser() common.Computer {
	const BufferSize = 100

	lpBuffer := make([]utils.WideChar, BufferSize)
	var lpnSize C.DWORD = BufferSize
	ptr := (*C.WCHAR)(unsafe.Pointer(&lpBuffer[0]))
	C.GetUserNameW(ptr, &lpnSize)

	username := utils.GetWideString(lpBuffer, int(lpnSize))

	lpnSize = BufferSize
	C.GetComputerNameW(ptr, &lpnSize)
	computername := utils.GetWideString(lpBuffer, int(lpnSize))

	return common.Computer{
		Username: utils.TrimCStr(username),
		Hostname: utils.TrimCStr(computername),
		HomeDir:  "",
	}
}
