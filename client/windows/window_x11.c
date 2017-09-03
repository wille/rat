//+build !windows,!darwin

#include <X11/Xlib.h>
#include <X11/Xatom.h>
#include <X11/Xutil.h>

#include "window.h"


void EnumWindows(Display *display, Window window) {
	XTextProperty text;
	XGetWMName(display, window, &text);
	
	Frame frame;
	frame.handle = window;
	frame.title = text.value;
	frame.rect = GetWindowDimensions(window);
	WindowCallback(frame);

	Window root, parent;
	Window *children;
	int n;
	XQueryTree(display, window, &root, &parent, &children, &n);
	
	if (children != NULL) {
		for (int i = 0; i < n; i++) {
			EnumWindows(display, children[i]);
		}

		XFree(children);
	}
}

void QueryWindows(void) {
	Display *display = XOpenDisplay(NULL);
	Window root = XDefaultRootWindow(display);
	EnumWindows(display, root);
}

Rect GetWindowDimensions(int handle) {
	Rect rect;
	rect.x = 0;
	rect.y = 0;
	rect.width = 0;
	rect.height = 0;
	return rect;
}

void SetWindowPosition(int handle, Rect rect) {

}