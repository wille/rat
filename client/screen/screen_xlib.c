//+build !windows,!darwin

#include <X11/Xlib.h>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "bitmap.h"
#include "screen.h"

char *GetBitmap(XImage *img, int *size);

void QueryMonitors(void) {
	Display *display;
    int screen;
    Window root;
    display = XOpenDisplay(NULL);
    screen = DefaultScreen(display);
    root = RootWindow(display, screen);
    XWindowAttributes gwa;

    XGetWindowAttributes(display, root, &gwa);

	XCloseDisplay(display);

   	Monitor m;

	m.coordinates.x = gwa.x;
	m.coordinates.y = gwa.y;
	m.coordinates.width = gwa.width;
	m.coordinates.height = gwa.height;

	MonitorCallback(m);
}

char *GetScreenshot(Monitor monitor, int *size) {
	Display *display;
    int screen;
    Window root;
    display = XOpenDisplay(NULL);
    screen = DefaultScreen(display);
    root = RootWindow(display, screen);

    XImage *img = XGetImage(display, root, monitor.coordinates.x, monitor.coordinates.y, monitor.coordinates.width, monitor.coordinates.height, AllPlanes, ZPixmap);

	char *buffer = GetBitmap(img, size);

	XDestroyImage(img);
	XCloseDisplay(display);

	return buffer;
}

char *GetBitmap(XImage *img, int *size) {
	BITMAPFILEHEADER bmpFileHeader;
    BITMAPINFOHEADER bmpInfoHeader;
    FILE *fp;

    memset(&bmpFileHeader, 0, sizeof(BITMAPFILEHEADER));
    memset(&bmpInfoHeader, 0, sizeof(BITMAPINFOHEADER));
    bmpFileHeader.bfType = 0x4D42;
    bmpFileHeader.bfOffBits = sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER);
    bmpFileHeader.bfReserved1 = 0;
    bmpFileHeader.bfReserved2 = 0;
    int biBitCount = 32;
    int dwBmpSize = ((img->width * biBitCount + 31) / 32) * 4 * img->height;

    bmpFileHeader.bfSize = sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER) + dwBmpSize;

    bmpInfoHeader.biSize = sizeof(BITMAPINFOHEADER);
    bmpInfoHeader.biWidth = img->width;
    bmpInfoHeader.biHeight = img->height;
    bmpInfoHeader.biPlanes = 1;
    bmpInfoHeader.biBitCount = biBitCount;
    bmpInfoHeader.biSizeImage = 0;
    bmpInfoHeader.biCompression = 0;
    bmpInfoHeader.biXPelsPerMeter = 0;
    bmpInfoHeader.biYPelsPerMeter = 0;
    bmpInfoHeader.biClrUsed = 0;
    bmpInfoHeader.biClrImportant = 0;

#ifdef DEBUG_WRITE_RAW
	fp = fopen("bitmap.bmp", "wb");

    if (fp != NULL) {
		fwrite(&bmpFileHeader, sizeof(bmpFileHeader), 1, fp);
		fwrite(&bmpInfoHeader, sizeof(bmpInfoHeader), 1, fp);
		fwrite(img->data, dwBmpSize, 1, fp);
		fclose(fp);
	}
#endif

	int len = sizeof(bmpFileHeader) + sizeof(bmpInfoHeader) + dwBmpSize;
	*size = len;
	char *buf = malloc(len);
	memcpy(buf, &bmpFileHeader, sizeof(bmpFileHeader));
	memcpy(buf + sizeof(bmpFileHeader), &bmpInfoHeader, sizeof(bmpInfoHeader));
	memcpy(buf + sizeof(bmpFileHeader) + sizeof(bmpInfoHeader), img->data, dwBmpSize);
	
	return buf;
}