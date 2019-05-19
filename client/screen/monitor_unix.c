//+build !windows,!darwin

#include <X11/extensions/Xrandr.h>
#include "screen.h"
 
void QueryMonitors(void) {
	Display *display;
  display = XOpenDisplay(NULL);

  XRRScreenResources *screen = XRRGetScreenResources(display, DefaultRootWindow(display));

	int i;
	for (i = 0; i < screen->ncrtc; i++) {
    XRRCrtcInfo *crtc_info = XRRGetCrtcInfo(display, screen, screen->crtcs[i]);

		Monitor m;

		m.id = i;
		m.coordinates.x = crtc_info->x;
		m.coordinates.y = crtc_info->y;
		m.coordinates.width = crtc_info->width;
		m.coordinates.height = crtc_info->height;

		MonitorCallback(m);
	}

	XCloseDisplay(display);
}
