//+build darwin

#import <ApplicationServices/ApplicationServices.h>

#include "bitmap.h"
#include "screen.h"

CGContextRef CreateARGBBitmapContext(CGImageRef inImage);

void QueryMonitors(void) {
    CGDisplayCount displayCount;
    CGDirectDisplayID displays[32];

    CGGetActiveDisplayList(32, displays, &displayCount);

    for (int i = 0; i < displayCount; i++) {
		CGDirectDisplayID display = displays[i];
		CGImageRef image = CGDisplayCreateImage(display);

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

char *GetScreenshot(Monitor monitor, int *size) {
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

    CGContextRef cgctx = CreateARGBBitmapContext(image);
	if (cgctx == NULL) {
		return NULL;
	}
	
	size_t w = CGImageGetWidth(image);
	size_t h = CGImageGetHeight(image);
	CGRect rect = {{0, 0}, {w, h}};

	CGContextDrawImage(cgctx, rect, image);

	char *buf;

	void *data = CGBitmapContextGetData(cgctx);
	if (data != NULL) {
		buf = GetBitmap(data, size, w, h);
	}

	CGContextRelease(cgctx);
	CGImageRelease(image);

	if (data) {
		free(data);
	}

	return buf;
}

CGContextRef CreateARGBBitmapContext(CGImageRef inImage) {
    CGContextRef context = NULL;
    CGColorSpaceRef colorSpace;
    void *bitmapData;
    int bitmapByteCount;
    int bitmapBytesPerRow;

    // Get image width, height. We'll use the entire image.
    size_t pixelsWide = CGImageGetWidth(inImage);
    size_t pixelsHigh = CGImageGetHeight(inImage);

    // Declare the number of bytes per row. Each pixel in the bitmap in this
    // example is represented by 4 bytes; 8 bits each of red, green, blue, and
    // alpha.
    bitmapBytesPerRow = (pixelsWide * 4);
    bitmapByteCount = (bitmapBytesPerRow * pixelsHigh);

    // Use the generic RGB color space.
    colorSpace = CGColorSpaceCreateWithName(kCGColorSpaceGenericRGB);
    if (colorSpace == NULL) {
		fprintf(stderr, "Error allocating color space\n");
		return NULL;
    }

    // Allocate memory for image data. This is the destination in memory
    // where any drawing to the bitmap context will be rendered.
    bitmapData = malloc(bitmapByteCount);
    if (bitmapData == NULL) {
		fprintf(stderr, "Memory not allocated!");
		CGColorSpaceRelease(colorSpace);
		return NULL;
    }

    // Create the bitmap context. We want pre-multiplied ARGB, 8-bits
    // per component. Regardless of what the source image format is
    // (CMYK, Grayscale, and so on) it will be converted over to the format
    // specified here by CGBitmapContextCreate.
    context = CGBitmapContextCreate(bitmapData, pixelsWide, pixelsHigh, 8, // bits per component
					bitmapBytesPerRow,
				    colorSpace,
					(CGBitmapInfo) kCGImageAlphaPremultipliedLast);

    if (context == NULL) {
		free(bitmapData);
		fprintf(stderr, "Context not created!");
    }

    CGColorSpaceRelease(colorSpace);

    return context;
}
