//+build darwin

#import <ApplicationServices/ApplicationServices.h>

#include <stdlib.h>

#include "input.h"

extern CGKeyCode GetCode(unsigned char keycode);

// save for click event
static int lastX, lastY;

void MoveCursor(int m, int x, int y) {
	lastX = x;
	lastY = y;
	CGDisplayMoveCursorToPoint((CGDirectDisplayID) m, CGPointMake(x, y));
}

void Mouse(int m, int button, int type) {
	if (button == LEFT) {
		button = kCGMouseButtonLeft;
		switch (type) {
			case PRESS:
				type = kCGEventLeftMouseDown;
				break;
			case RELEASE:
				type = kCGEventLeftMouseUp;
				break;
			default:
				fprintf(stderr, "invalid event type: %i\n", type);
				return;
		}
	} else if (button == RIGHT) {
		button = kCGMouseButtonRight;
		switch (type) {
			case PRESS:
				type = kCGEventRightMouseDown;
				break;
			case RELEASE:
				type = kCGEventRightMouseUp;
				break;
			default:
				fprintf(stderr, "invalid event type: %i\n", type);
				return;
		}
	} else {
		fprintf(stderr, "invalid button type: %i\n", button);
		return;
	}

	CGEventRef event = CGEventCreateMouseEvent(NULL, type, CGPointMake(lastX, lastY), button);
    CGEventPost(kCGHIDEventTap, event);
	CFRelease(event);
}

void Key(unsigned short key, int t) {
	bool keyDown = t == PRESS;

	CGKeyCode code = GetCode(key);

	CGEventRef event = CGEventCreateKeyboardEvent(NULL, code, keyDown);
	CGEventPost(kCGHIDEventTap, event);
	CFRelease(event);
}