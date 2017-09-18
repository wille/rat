#ifndef _SCREEN_WINDOWS_H
#define _SCREEN_WINDOWS_H

#include "screen.h"

// Captures monitor screenshot 
char *CaptureMonitor(Monitor m);

// Releases all resources
void Release(void);

#endif