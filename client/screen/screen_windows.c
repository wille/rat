#include <windows.h>
#include <stdio.h>

#include "screen.h"
#include "screen_windows.h"

static int monitor = 0;

char *GetBitmap(HBITMAP, HDC, int *size);

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
	m.id = monitor++;

	MonitorCallback(m);

	return TRUE;
}

void QueryMonitors(void) {
	monitor = 0;
	HDC hdc = GetDC(NULL);
	EnumDisplayMonitors(NULL, NULL, MonitorEnumProc, 0);
	ReleaseDC(NULL, hdc);
}

char *CaptureMonitor(Monitor monitor) {
    int x = monitor.coordinates.x;
    int y = monitor.coordinates.y;
    int width = monitor.coordinates.width;
    int height = monitor.coordinates.height;

    BITMAPINFO bt;
	bt.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
	bt.bmiHeader.biWidth = width;
	bt.bmiHeader.biHeight = -height;
	bt.bmiHeader.biPlanes = 1;
	bt.bmiHeader.biBitCount = 32;
    bt.bmiHeader.biCompression = BI_RGB;
    
    void *ptr = NULL;

    HDC hDC = GetDC(0);
    HDC m_HDC = CreateCompatibleDC(hDC);

    HBITMAP m_hBmp = CreateDIBSection(m_HDC, &bt, DIB_RGB_COLORS, &ptr, 0, 0);

    HGDIOBJ o = SelectObject(m_HDC, m_hBmp);

    BitBlt(m_HDC, 0, 0, width, height, hDC, x, y, SRCCOPY); // w, h
    
    
    int len = x * y * 4;
    char *c = (char*) ptr;
    
    for (int i = 0; i < len; i += 4) {
        int r = c[i];
        int b = c[i + 2];
    
        c[i] = b;
        c[i + 2] = r;        
    }

    /*
    ReleaseDC(0, hDC);
    DeleteDC(m_HDC);
    DeleteObject(m_hBmp);
    DeleteObject(o);
    */

    return c;
}
