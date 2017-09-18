#ifndef _SCREEN_WINDOWS_H
#define _SCREEN_WINDOWS_H

#include "screen.h"

typedef struct {
	int width;
	int height;
	char *data;
} Capture;

// Captures monitor screenshot 
Capture CaptureMonitor(Monitor m);
Capture CaptureWindow(int hwnd);

// Releases all resources
void Release(void);


#endif