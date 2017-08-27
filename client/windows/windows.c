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
    window.rect = GetWindowDimensions(handle);

    Callback(window);

    free(window.title);

    return TRUE;
}

void QueryWindows(void) {
    EnumWindows(EnumWindowsCallback, 0);
}

Rect GetWindowDimensions(int handle) {
    RECT wrect;
    GetWindowRect((HWND) handle, &wrect);

    Rect rect;
    rect.x = wrect.left;
    rect.y = wrect.top;
    rect.width = wrect.right - wrect.left;
    rect.height = wrect.bottom - wrect.top;

    return rect;
}

void SetWindowPosition(int handle, Rect rect) {
    MoveWindow((HWND) handle, rect.x, rect.y, rect.width, rect.height, TRUE);
}