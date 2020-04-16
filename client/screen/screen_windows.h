#ifndef _SCREEN_WINDOWS_H
#define _SCREEN_WINDOWS_H

#include <windows.h>
#include "screen.h"

typedef struct Capture {
	int x, y, width, height;
    char *data;
    HDC srcDC;
    HDC dstDC;
    HBITMAP bitmap;
    HGDIOBJ o;

    CURSORINFO ci;
    char *cursor_data;
    int cursorWidth, cursorHeight;
    int cursorHotX, cursorHotY;
} Capture;


Capture *init_capture();
void destroy_capture(Capture*);
void capture_monitor(Capture*, int, int, int, int);
DWORD QueryCursor(Capture*);
// Captures monitor screenshot 
// Capture CaptureMonitor(Monitor m);
// Capture CaptureWindow(int hwnd);

// // Releases all resources
// void Release(Capture);


#endif