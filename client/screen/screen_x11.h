#ifndef _SCREEN_X11_H
#define _SCREEN_X11_H

#include <X11/Xlib.h>

#include "screen.h"

// Destroy XImage after being processed
void DestroyImage(XImage *image);

// Captures monitor screenshot 
XImage *CaptureMonitor(Monitor m);

#endif