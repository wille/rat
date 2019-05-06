//+build !windows,!darwin,x11

#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/extensions/Xrandr.h>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "bitmap.h"
#include "screen.h"
#include "screen_x11.h"

Capture CaptureWindow(int handle) {
    Capture cap;
    cap.error = 0;
    cap.image = NULL;

    Display *display = XOpenDisplay(NULL);
    Window window = (Window) handle;

    XWindowAttributes attr;
    if (cap.error = XGetWindowAttributes(display, window, &attr) != Success) {
        goto end;
    }

    int x = attr.x;
    int y = attr.y;
    int width = attr.width;
    int height = attr.height;

    XImage *img = XGetImage(display, window, x, y, width, height, AllPlanes, ZPixmap);

    PixelSwap(img->data, width * height * 4);

    XCloseDisplay(display);

    cap.width = width;
    cap.height = height;
    cap.image = img;

end:
    return cap;
}

Capture CaptureMonitor(Monitor monitor) {
    Capture cap;
    cap.error = 0;

    Display *display = XOpenDisplay(NULL);
    Window root = DefaultRootWindow(display);

    XImage *img = XGetImage(display, root, monitor.coordinates.x, monitor.coordinates.y, monitor.coordinates.width, monitor.coordinates.height, AllPlanes, ZPixmap);

    PixelSwap(img->data, monitor.coordinates.width * monitor.coordinates.height * 4);

    XCloseDisplay(display);

    cap.width = monitor.coordinates.width;
    cap.height = monitor.coordinates.height;
    cap.image = img;

    return cap;
}

void DestroyImage(Capture cap) {
    XDestroyImage(cap.image);
}
