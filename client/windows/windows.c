//+build windows

#include <windows.h>
#include <psapi.h>

#include "window.h"
#include "winuser.h"

bool IsVisible(HANDLE handle) {
    RECT rect;
	GetWindowRect(handle, &rect);

	return IsWindowVisible(handle) && rect.left > -32000 && rect.top > -32000;
}

LPSTR GetWindowTitle(HWND handle) {
    int length = GetWindowTextLengthA(handle) + 1;

    LPSTR buffer = (LPSTR)malloc(length * sizeof(WCHAR));

    GetWindowTextA(handle, buffer, length + 1);

    return buffer;
}

BOOL GetWindowIcon(HWND hwnd, Icon *icon) {
    int width = 32;
    int height = 32;

    HICON hIcon = SendMessage(hwnd, WM_GETICON, ICON_SMALL2, 0);

    if (hIcon == NULL) {
       hIcon = SendMessage(hwnd, WM_GETICON, ICON_SMALL, 0);
    }

    if (hIcon == NULL) {
        hIcon = SendMessage(hwnd, WM_GETICON, ICON_BIG, 0);
    }

    if (hIcon == NULL) {
        return FALSE;
    }

    BITMAPINFO bt;
	bt.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
	bt.bmiHeader.biWidth = width;
	bt.bmiHeader.biHeight = -height;
	bt.bmiHeader.biPlanes = 1;
	bt.bmiHeader.biBitCount = 32;
    bt.bmiHeader.biCompression = BI_RGB;

    char *data = NULL;

    HDC hDC = CreateCompatibleDC(NULL);
    HBITMAP hBitmap = CreateDIBSection(hDC, &bt, DIB_RGB_COLORS, &data, 0, 0);
    
    HBITMAP hOldBitmap = (HBITMAP) SelectObject(hDC, hBitmap);
    DrawIcon(hDC, 0, 0, hIcon);
    SelectObject(hDC, hOldBitmap);

    int size = width * height  * 4;

    for (int i = 0; i < size; i += 4) {
        int r = data[i];
        int b = data[i + 2];
    
        data[i] = b;
        data[i + 2] = r;        
    }

    icon->width = width;
    icon->height = height;

    // Copy the icon data so we can get rid of the bitmap and HDC
    char *cpy = malloc(size);
    memcpy(cpy, data, size);
    icon->data = cpy;

    DeleteDC(hDC);
    DeleteObject(hBitmap);

    return TRUE;
}

WindowRectangle GetWindowDimensions(HANDLE handle) {
    RECT wrect;
    GetWindowRect((HWND) handle, &wrect);

    WindowRectangle rect;
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

    if (!GetWindowIcon(handle, &window.icon)) {
        // Getting icon has failed
        // Set data pointer to NULL to indicate error
        window.icon.data = NULL;
    }

    WindowCallback(window);

    free(window.title);

    return TRUE;
}

void QueryWindows(void) {
    EnumWindows(EnumWindowsCallback, 0);
}

void SetDisplayState(HANDLE handle, bool visible) {	
	if (visible) {
		ShowWindow(handle, SW_SHOW);
	} else {
		ShowWindow(handle, SW_MINIMIZE);
	}
}
