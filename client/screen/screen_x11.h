#ifndef _SCREEN_X11_H
#define _SCREEN_X11_H

#include <X11/Xlib.h>

#include "screen.h"

typedef struct {
    int error;
    XImage *image;
    int width;
    int height;
} Capture;

// Destroy XImage after being processed
void DestroyImage(Capture cap);

Capture CaptureWindow(int handle);

// Captures monitor screenshot 
Capture CaptureMonitor(Monitor m);

#endif