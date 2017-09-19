//+build !windows,!darwin

#include <X11/Xlib.h>
#include <X11/Xutil.h>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "bitmap.h"
#include "screen.h"
#include "screen_x11.h"

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

Capture CaptureWindow(int handle) {
    Display *display = XOpenDisplay(NULL);
    Window window = (Window) handle;

    XWindowAttributes attr;
    XGetWindowAttributes(display, window, &attr);

    int x = attr.x;
    int y = attr.y;
    int width = attr.width;
    int height = attr.height;

    XImage *img = XGetImage(display, window, x, y, width, height, AllPlanes, ZPixmap);
    
    PixelSwap(img->data, width * height * 4);
    
    XCloseDisplay(display);

    Capture cap;
    cap.width = width;
    cap.height = height;
    cap.image = img;

    return cap;
}

Capture CaptureMonitor(Monitor monitor) {
	Display *display;
    int screen;
    Window root;
    display = XOpenDisplay(NULL);
    screen = DefaultScreen(display);
    root = RootWindow(display, screen);

    XImage *img = XGetImage(display, root, monitor.coordinates.x, monitor.coordinates.y, monitor.coordinates.width, monitor.coordinates.height, AllPlanes, ZPixmap);

    PixelSwap(img->data, monitor.coordinates.width * monitor.coordinates.height * 4);

    XCloseDisplay(display);

    Capture cap;
    cap.width = monitor.coordinates.width;
    cap.height = monitor.coordinates.height;
    cap.image = img;
    
    return cap;
}

void DestroyImage(Capture cap) {
    XDestroyImage(cap.image);
}
