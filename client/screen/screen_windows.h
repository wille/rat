#ifndef _SCREEN_WINDOWS_H
#define _SCREEN_WINDOWS_H

#include "screen.h"

typedef struct {
	int width;
	int height;
    char *data;
    HDC hDC;
    HDC cHDC;
    HBITMAP bitmap;
    HGDIOBJ o;
} Capture;

// Captures monitor screenshot 
Capture CaptureMonitor(Monitor m);
Capture CaptureWindow(int hwnd);

// Releases all resources
void Release(Capture);


#endif