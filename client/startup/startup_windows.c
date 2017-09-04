#include <windows.h>

#include "startup_windows.h"

int Install(char *name, char *path) {
	HKEY key;
	LONG result = RegOpenKey(HKEY_CURRENT_USER, "Software\\Microsoft\\Windows\\CurrentVersion\\Run", &key);
	if (result != ERROR_SUCCESS) {
		return result;
	}

	result = RegSetValueEx(key, name, 0, REG_SZ, (LPBYTE)path, strlen(path));
	if (result != ERROR_SUCCESS) {
		return result;
	}

	RegCloseKey(key);

	free(name);
	free(path);
	
	return 0;
}

int Uninstall(char *name) {
	HKEY key;
    
	LONG result = RegOpenKeyEx(HKEY_CURRENT_USER, NULL, 0, KEY_CREATE_SUB_KEY, &key);
	if (result != ERROR_SUCCESS) {
		return result;
	}

    result = RegDeleteKeyValueA(key, "Software\\Microsoft\\Windows\\CurrentVersion\\Run", name);
    RegCloseKey(key);
    
	free(name);
	
	return result;
}