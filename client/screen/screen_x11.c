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

    // not using bitmap.c:PixelSwap here, need to do more testing on windows and macos
    // ensure alpha is 255 and swap R,B
    for (int i = 0; i < monitor.coordinates.width * monitor.coordinates.height * 4; i += 4) {
        unsigned int *p = (unsigned int*) &img->data[i];
        *p = (0xff << 24) |   
            ((*p & 0x00FF0000) >>  16) |
            ((*p & 0x000000FF) <<  16) |
            ((*p & 0x0000FF00));
    }

    XCloseDisplay(display);

    cap.width = monitor.coordinates.width;
    cap.height = monitor.coordinates.height;
    cap.image = img;

    return cap;
}

void DestroyImage(Capture cap) {
    XDestroyImage(cap.image);
}
