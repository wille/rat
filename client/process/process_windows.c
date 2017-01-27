#include <windows.h>
#include <tchar.h>
#include <psapi.h>

#include "process.h"

void QueryProcesses(void) {
    DWORD aProcesses[1024], pBytesReturned, cProcesses;

    if (!EnumProcesses(aProcesses, sizeof(aProcesses), &pBytesReturned)) {
		return;
    }

    cProcesses = pBytesReturned / sizeof(DWORD);

    for (int i = 0; i < cProcesses; i++) {
		DWORD processID = aProcesses[i];

		if (aProcesses[i] != 0) {
			TCHAR szProcessName[MAX_PATH] = "<unknown>";

			HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, processID);

			if (hProcess != NULL) {
				HMODULE hMod;
				DWORD pBytesReturned;

				if (EnumProcessModules(hProcess, &hMod, sizeof(hMod), &pBytesReturned)) {
					GetModuleFileNameEx(hProcess, hMod, szProcessName, sizeof(szProcessName) / sizeof(TCHAR));
				}

				Process p;
				p.path = malloc(MAX_PATH);
				strcpy(p.path, szProcessName);

				p.pid = processID;
				ProcessCallback(p);
			}

			CloseHandle(hProcess);
		}
    }
}