//+build darwin

#import <ApplicationServices/ApplicationServices.h>

#include "input.h"

void MoveCursor(int m, int x, int y) {
	CGDisplayCount displayCount;
    CGDirectDisplayID displays[32];
    CGGetActiveDisplayList(32, displays, &displayCount);

	CGDirectDisplayID display;

    for (int i = 0; i < displayCount; i++) {
		CGDirectDisplayID d = displays[i];

		if (d == m) {
			display = d;
			break;
		}
	}

	CGDisplayMoveCursorToPoint(display, CGPointMake(x, y));
}