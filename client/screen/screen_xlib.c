//+build !windows,!darwin

#include <X11/Xlib.h>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "bitmap.h"
#include "screen.h"

void QueryMonitors(void) {
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
		XWindowAttributes gwa;

		XGetWindowAttributes(display, root, &gwa);

		Monitor m;

		m.id = screen_number;
		m.coordinates.x = gwa.x;
		m.coordinates.y = gwa.y;
		m.coordinates.width = gwa.width;
		m.coordinates.height = gwa.height;

		MonitorCallback(m);
	}

	XCloseDisplay(display);
}

char *GetScreenshot(Monitor monitor, int *size) {
	Display *display;
    int screen;
    Window root;
    display = XOpenDisplay(NULL);
    screen = DefaultScreen(display);
    root = RootWindow(display, screen);

    XImage *img = XGetImage(display, root, monitor.coordinates.x, monitor.coordinates.y, monitor.coordinates.width, monitor.coordinates.height, AllPlanes, ZPixmap);

	char *buffer = GetBitmap(img->data, size, img->width, img->height);

	XDestroyImage(img);
	XCloseDisplay(display);

	return buffer;
}