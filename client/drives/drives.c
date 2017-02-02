//+build windows

#include <windows.h>

#include "drives.h"

void QueryDrives(void) {
    int counter = 0;
	int letter = (int)'a';

	DWORD dwDrivesMask = GetLogicalDrives();

	if (dwDrivesMask == 0) {
		Callback((char) 0);
		return;
	}

	while (counter < 24) {
		if (dwDrivesMask & (1 << counter)) {
			Callback((char) (letter + counter));
		}
		counter++;
	}
}