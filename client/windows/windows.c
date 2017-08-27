//+build windows

#include <windows.h>
#include <psapi.h>

#include "window.h"

LPWSTR GetWindowTitle(HWND handle) {
    int length = GetWindowTextLengthA(handle) + 1;

    LPWSTR buffer = (LPWSTR)malloc(length * sizeof(WCHAR));

    GetWindowTextW(handle, buffer, length + 1);

    return buffer;
}

BOOL CALLBACK EnumWindowsCallback(HWND handle, LPARAM lParam) {
    Window window;

    window.title = GetWindowTitle(handle);
    window.handle = (int)handle;

    Callback(window);

    free(window.title);

    return TRUE;
}

void QueryWindows(void) {
    EnumWindows(EnumWindowsCallback, 0);
}