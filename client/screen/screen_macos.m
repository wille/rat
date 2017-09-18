//+build darwin

#import <ApplicationServices/ApplicationServices.h>
#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>

#include "screen.h"
#include "screen_macos.h"
#include "bitmap.h"

void QueryMonitors(void) {
    CGDisplayCount displayCount;
    CGDirectDisplayID displays[32];

    CGGetActiveDisplayList(32, displays, &displayCount);

    for (int i = 0; i < displayCount; i++) {
		CGDirectDisplayID display = displays[i];

		int width = CGDisplayPixelsWide(display);
		int height = CGDisplayPixelsHigh(display);

		Monitor m;

		m.id = display;
		m.coordinates.x = 0;
		m.coordinates.y = 0;
		m.coordinates.width = width;
		m.coordinates.height = height;

		MonitorCallback(m);
    }
}

static CFDataRef dataRef;

Capture CaptureWindow(int handle) {
	CGImageRef image = CGWindowListCreateImage(CGRectNull, kCGWindowListOptionIncludingWindow, handle, kCGWindowImageShouldBeOpaque);
	int width = CGImageGetWidth(image) - 1;
	int height = CGImageGetHeight(image) - 1;

	// resize image to prevent it scrambled (spent hours to investigate so I don't give a fuck)
	CGRect rect = CGRectMake(0, 0, width, height);
	image = CGImageCreateWithImageInRect(image, rect);

	CFDataRef ref = CGDataProviderCopyData(CGImageGetDataProvider(image));
	char *c = CFDataGetBytePtr(ref);

	PixelSwap(c, width * height * 4);

	Capture cap;
	cap.data = c;
	cap.width = width;
    cap.height = height;

    return cap;
}

Capture CaptureMonitor(Monitor monitor) {
	CGDisplayCount displayCount;
    CGDirectDisplayID displays[32];
    CGGetActiveDisplayList(32, displays, &displayCount);

	CGDirectDisplayID display;

    for (int i = 0; i < displayCount; i++) {
		CGDirectDisplayID d = displays[i];

		if (d == monitor.id) {
			display = d;
			break;
		}
	}

	CGImageRef image = CGDisplayCreateImage(display);

	dataRef = CGDataProviderCopyData(CGImageGetDataProvider(image));

	char* c = CFDataGetBytePtr(dataRef);

	PixelSwap(c, monitor.coordinates.width * monitor.coordinates.height * 4);

	Capture cap;
	cap.width = monitor.coordinates.width;
	cap.height = monitor.coordinates.height;
	cap.data = c;

	return cap;
}

void Release() {

}

