#ifndef _SCREEN_MACOS_H
#define _SCREEN_MACOS_H


typedef struct {
	int width;
	int height;
	char *data;
} Capture;

void Release();
Capture CaptureMonitor(Monitor m);
Capture CaptureWindow(int handle);

#endif
