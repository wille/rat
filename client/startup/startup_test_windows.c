#include "startup_test_windows.h"

bool CheckRegistry(char *name) {
    HKEY key;

    RegOpenKeyEx(HKEY_CURRENT_USER, "Software\\Microsoft\\Windows\\CurrentVersion\\Run", 0, KEY_READ, &key);
    LONG result = RegQueryValueEx(key, name, NULL, NULL, NULL, NULL);
    RegCloseKey(key);

	free(name);
    
    return result == ERROR_SUCCESS;
}
