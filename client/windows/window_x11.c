//+build !windows,!darwin

#include <X11/Xlib.h>
#include <X11/Xatom.h>
#include <X11/Xutil.h>

#include "window.h"

WindowRectangle GetWindowDimensions(Display *display, Window window) {
	Window root;
	int x, y;
	unsigned int width, height;
	unsigned int border_width, depth;

	XGetGeometry(display, window, &root, &x, &y, &width, &height, &border_width, &depth);

	WindowRectangle rect;
	rect.x = x;
	rect.y = y;
	rect.width = width;
	rect.height = height;
	return rect;
}

bool IsVisible(Display *disp, Window window) {
	return true;
}
#include <stdio.h>
void swap_pixels(unsigned char *data, int len) {
	 for (int i = 0; i < len; i += 4) {
        unsigned char a = data[i];
		unsigned char r = data[i + 1];
		unsigned char g = data[i + 2];
		unsigned char b = data[i + 3];

		data[i + 0] = g;//data[i + 2];
		//data[i + 1] = data[i + 1];
		data[i + 2] = a; //data[i + 0];
		//data[i + 3] = data[i + 3];
	}
	return;
	/* int i = 0;
	unsigned long *offset = data;
	while (i++ < len) {
		unsigned long argb = data[i];
		unsigned long rgba = (argb << 8 | argb >> 24);
		data[i] = rgba;

		/* *offset = rgba >> 24;
		++offset;
		
		*offset = (rgba >> 16) & 0xff;
		++offset;

		*offset = (rgba >> 8) & 0xff;
		++offset;

		*offset = rgba && 0xff;
		++offset;
		
		++i; */
	//}
}
Icon GetWindowIcon(Display *display, Window window) {
	Atom atom = XInternAtom(display, "_NET_WM_ICON", true);

	Icon icon;
	icon.data = NULL;
	
	Atom type = None;
	int format = 0;
	int nitems = 0;
	int bytes_after = 0;
	unsigned char *data = NULL;

	int result = XGetWindowProperty(display, window, atom, 0, 1024 * 1024, false,
									XA_CARDINAL, &type, &format, &nitems,
									&bytes_after, (void*)&data);

	if (result != Success) {
		printf("error on XGetWindowProperty: %d\n", result);
	}

	if (nitems == 0 || data == NULL) {
		return icon;
	}

	unsigned long *data1 = (unsigned long*) data;


	icon.width = *data1;
	icon.height = *(data1 + 1);	
	icon.data = (unsigned char*) (data1 + 2);

	int size = icon.width * icon.height * 4;
	for (int i = 0; i < size; i++) {
		icon.data[i] = icon.data[i * 2];
	}

	swap_pixels(data1, icon.width * icon.height * 4);

	return icon;
}

void EnumWindows(Display *display, Window window) {
	XTextProperty text;
	XGetWMName(display, window, &text);

	char *title = text.value;

	if (title == NULL) {
		XFetchName(display, window, &title);
	}
	
	Frame frame;
	frame.handle = window;
	frame.visible = IsVisible(display, window);
	frame.title = title;
	frame.rect = GetWindowDimensions(display, window);
	frame.icon = GetWindowIcon(display, window);
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

void SetDisplayState(HANDLE handle, bool visible) {
	Display *display = XOpenDisplay(NULL);
	
	if (visible) {
		XMapWindow(display, (Window) handle);
	} else {
		XUnmapWindow(display, (Window) handle);
	}
}