//+build linux

#include <X11/Xlib.h>

#include "input.h"

void MoveCursor(int m, int x, int y) {
	Display *display;
    Screen *screen;
    Window root;
    display = XOpenDisplay(NULL);
	
	int screen_count = ScreenCount(display);
	int i;
	for (i = 0; i < screen_count; i++) {
		screen = ScreenOfDisplay(display, i);
		int screen_number = *(int*)screen;

		root = RootWindow(display, screen_number);
		
		if (screen_number == m) {
			XSelectInput(display, root, KeyReleaseMask);
			XWarpPointer(display, None, root, 0, 0, 0, 0, x, y);
			break;
		}
	}

	XCloseDisplay(display);
}