//+build windows

#include <windows.h>
#include <psapi.h>

#include "window.h"

LPSTR GetWindowTitle(HWND handle) {
    int length = GetWindowTextLengthA(handle) + 1;

    LPSTR buffer = (LPSTR)malloc(length * sizeof(WCHAR));

    GetWindowTextA(handle, buffer, length + 1);

    return buffer;
}

Rect GetWindowDimensions(HANDLE handle) {
    RECT wrect;
    GetWindowRect((HWND) handle, &wrect);

    Rect rect;
    rect.x = wrect.left;
    rect.y = wrect.top;
    rect.width = wrect.right - wrect.left;
    rect.height = wrect.bottom - wrect.top;

    return rect;
}

BOOL CALLBACK EnumWindowsCallback(HWND handle, LPARAM lParam) {
    Frame window;

    window.title = GetWindowTitle(handle);
    window.handle = (HANDLE)handle;
    window.visible = IsVisible(handle);
    window.rect = GetWindowDimensions(handle);

    WindowCallback(window);

    free(window.title);

    return TRUE;
}

void QueryWindows(void) {
    EnumWindows(EnumWindowsCallback, 0);
}

bool IsVisible(HANDLE handle) {
    RECT rect;
	GetWindowRect(handle, &rect);

	return IsWindowVisible(handle) && rect.left > -32000 && rect.top > -32000;
}
