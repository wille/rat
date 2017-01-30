#include <windows.h>

#include "startup_windows.h"

int Install(char *name, char *path) {
	HKEY key;
	RegOpenKey(HKEY_CURRENT_USER, "Software\\Microsoft\\Windows\\CurrentVersion\\Run", &key);
	RegSetValueEx(key, name, 0, REG_SZ, (LPBYTE)path, strlen(path));
	RegCloseKey(key);

	free(name);
	free(path);

	return 0;
}