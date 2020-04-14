#include <windows.h>
#include <wingdi.h>
#include <stdio.h>

#include "screen.h"
#include "screen_windows.h"
#include "bitmap.h"

BOOL CALLBACK MonitorEnumProc(HMONITOR hMonitor, HDC hdcMonitor, LPRECT lprcMonitor, LPARAM dwData) {
	Monitor m;

	int x = lprcMonitor->left;
	int y = lprcMonitor->top;
	int w = lprcMonitor->right - x;
	int h = lprcMonitor->bottom - y;
    m.coordinates.x = x;
	m.coordinates.y = y;
	m.coordinates.width = w;
	m.coordinates.height = h;
	m.id = *(int*)dwData++;

	MonitorCallback(m);

	return TRUE;
}

void QueryMonitors(void) {
	int monitor = 0;
	HDC hdc = GetDC(NULL);
	EnumDisplayMonitors(NULL, NULL, MonitorEnumProc, &monitor);
	ReleaseDC(NULL, hdc);
}

Capture *init_capture() {
    Capture *capture = malloc(sizeof(Capture));
    capture->data = NULL;
    capture->cursor_data = NULL;
    capture->ci.cbSize = sizeof(CURSORINFO);

    return capture;
}

void ccc(Capture *capture, HWND hwnd, int x, int y, int width, int height) {
     BITMAPINFO bt;
	bt.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
	bt.bmiHeader.biWidth = width;
	bt.bmiHeader.biHeight = -height;
	bt.bmiHeader.biPlanes = 1;
	bt.bmiHeader.biBitCount = 32;
    bt.bmiHeader.biCompression = BI_RGB;
    
    HDC hDC = GetDC(hwnd);
    HDC dstDC = CreateCompatibleDC(hDC);
    HBITMAP bitmap = CreateDIBSection(dstDC, &bt, DIB_RGB_COLORS, &capture->data, 0, 0);
    HGDIOBJ obj = SelectObject(dstDC, bitmap);

    BitBlt(dstDC, 0, 0, width, height, hDC, x, y, SRCCOPY);

    //ReleaseDC(0, hDC);
    //DeleteDC(dstDC);
    //DeleteObject(bitmap);
    //DeleteObject(obj);
}

void capture_monitor(Capture *capture, int x, int y, int width, int height) {
    return ccc(capture, 0, x, y, width, height);
}

void capture_window(Capture *capture, HWND hwnd) {
    RECT rect;
    GetWindowRect(hwnd, &rect);

    int width = rect.right - rect.left;
    int height = rect.bottom - rect.top;

    return ccc(capture, hwnd, rect.left, rect.top, width, height);
}

void destroy_capture(Capture *capture) {
    //ReleaseDC(0, cap.hDC);
    //DeleteDC(cap.cHDC);
    //DeleteObject(cap.bitmap);
    //DeleteObject(cap.o);
    free(capture);
}

DWORD QueryCursor(Capture *capture) {
    HCURSOR prev_cur = capture->ci.hCursor;

    // set this to avoid a 87
    capture->ci.cbSize = sizeof(CURSORINFO);
    if (!GetCursorInfo(&capture->ci)) {
        return GetLastError();
    }

    if (prev_cur != capture->ci.hCursor) {
        // Get your device contexts.
        HDC hdcScreen = GetDC(NULL);
        HDC dstDC = CreateCompatibleDC(hdcScreen);

        int w = 24;
        int h = 24;

        BITMAPINFO bt;
        bt.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
        bt.bmiHeader.biWidth = w;
        bt.bmiHeader.biHeight = -h;
        bt.bmiHeader.biPlanes = 1;
        bt.bmiHeader.biBitCount = 32;
        bt.bmiHeader.biCompression = BI_RGB;
      
        char *pCursorData;
        
        HBITMAP bitmap = CreateDIBSection(dstDC, &bt, DIB_RGB_COLORS, &pCursorData, 0, 0);
        HGDIOBJ obj = SelectObject(dstDC, bitmap);
        HGDIOBJ hbmOld = SelectObject(dstDC, bitmap);
        DrawIconEx(dstDC, 0, 0, capture->ci.hCursor, 0, 0, 0, NULL, DI_NORMAL);

        char *pPrevCursorData = capture->cursor_data;
        char *pCursorDataCopy = malloc(w*h*4);
        memcpy(pCursorDataCopy, pCursorData, w*h*4);
        capture->cursor_data = pCursorDataCopy;

        if (pPrevCursorData) {
            free(pPrevCursorData);
        }
        SelectObject(dstDC, hbmOld);
        DeleteObject(bitmap);
        DeleteDC(dstDC);
        ReleaseDC(0, hdcScreen);
    }

    return 1;
}
