#include <windows.h>
#include <stdio.h>
#include "screen.h"

static int monitor = 0;

char *GetBitmap(HBITMAP, HDC, int *size);

BOOL CALLBACK MonitorEnumProc(HMONITOR hMonitor, HDC hdcMonitor, LPRECT lprcMonitor, LPARAM dwData) {
	Monitor m;

	int x = lprcMonitor->left;
	int y = lprcMonitor->top;
	int w = lprcMonitor->right - x;
	int h = lprcMonitor->bottom - y;
    m.coordinates.x = x;
	m.coordinates.y = y;
	m.coordinates.width = w;
	m.coordinates.height = h;
	m.id = monitor++;

	MonitorCallback(m);

	return TRUE;
}

void QueryMonitors(void) {
	monitor = 0;
	HDC hdc = GetDC(NULL);
	EnumDisplayMonitors(NULL, NULL, MonitorEnumProc, 0);
	ReleaseDC(NULL, hdc);
}

char *GetScreenshot(Monitor monitor, int *size) {
    HDC hScreen = GetDC(NULL);
    HDC hDC = CreateCompatibleDC(hScreen);
    HBITMAP hBitmap = CreateCompatibleBitmap(hScreen, monitor.coordinates.width, monitor.coordinates.height);
    HGDIOBJ old_obj = SelectObject(hDC, hBitmap);
    BOOL bRet = BitBlt(hDC, 0, 0, monitor.coordinates.width, monitor.coordinates.height, hScreen, monitor.coordinates.x, monitor.coordinates.y, SRCCOPY);

    OpenClipboard(NULL);
    EmptyClipboard();
    SetClipboardData(CF_BITMAP, hBitmap);
    CloseClipboard();

	char *buffer = GetBitmap(hBitmap, hDC, size);
	
    SelectObject(hDC, old_obj);
    DeleteDC(hDC);
    ReleaseDC(NULL, hScreen);
    DeleteObject(hBitmap);

	return buffer;
}

char *GetBitmap(HBITMAP bitmap, HDC hDC, int *size) {
	BITMAP bmp; 
	PBITMAPINFO pbmi; 
	WORD cClrBits; 
	BITMAPFILEHEADER bmpFileHeader; // bitmap file-header 
	PBITMAPINFOHEADER bmpInfoHeader; // bitmap info-header 
	LPBYTE lpBits; // memory pointer 

	// create the bitmapinfo header information
	if (!GetObject(bitmap, sizeof(BITMAP), (LPSTR)&bmp)) {
		printf("Could not retrieve bitmap info");
		return NULL;
	}

	// Convert the color format to a count of bits. 
	cClrBits = (WORD)(bmp.bmPlanes * bmp.bmBitsPixel); 
	if (cClrBits == 1) 
		cClrBits = 1; 
	else if (cClrBits <= 4) 
		cClrBits = 4; 
	else if (cClrBits <= 8) 
		cClrBits = 8; 
	else if (cClrBits <= 16) 
		cClrBits = 16; 
	else if (cClrBits <= 24) 
		cClrBits = 24; 
	else cClrBits = 32; 

	if (cClrBits != 24) {
		pbmi = (PBITMAPINFO) LocalAlloc(LPTR, sizeof(BITMAPINFOHEADER) + sizeof(RGBQUAD) * (1<< cClrBits)); 
	} else {
		pbmi = (PBITMAPINFO) LocalAlloc(LPTR, sizeof(BITMAPINFOHEADER)); 
	}

	// Initialize the fields in the BITMAPINFO structure. 
	pbmi->bmiHeader.biSize = sizeof(BITMAPINFOHEADER); 
	pbmi->bmiHeader.biWidth = bmp.bmWidth; 
	pbmi->bmiHeader.biHeight = bmp.bmHeight; 
	pbmi->bmiHeader.biPlanes = bmp.bmPlanes; 
	pbmi->bmiHeader.biBitCount = bmp.bmBitsPixel; 
	if (cClrBits < 24) {
		pbmi->bmiHeader.biClrUsed = (1<<cClrBits); 
	}

	// If the bitmap is not compressed, set the BI_RGB flag. 
	pbmi->bmiHeader.biCompression = BI_RGB; 

	// Compute the number of bytes in the array of color 
	// indices and store the result in biSizeImage. 
	pbmi->bmiHeader.biSizeImage = (pbmi->bmiHeader.biWidth + 7) /8 * pbmi->bmiHeader.biHeight * cClrBits; 
	// Set biClrImportant to 0, indicating that all of the 
	// device colors are important. 
	pbmi->bmiHeader.biClrImportant = 0; 

	// now open file and save the data
	bmpInfoHeader = (PBITMAPINFOHEADER) pbmi; 
	lpBits = (LPBYTE) GlobalAlloc(GMEM_FIXED, bmpInfoHeader->biSizeImage);

	if (!lpBits) {
		printf("failed to alloc memory");
		return NULL;
	}

	// Retrieve the color table (RGBQUAD array) and the bits 
	if (!GetDIBits(hDC, bitmap, 0, (WORD) bmpInfoHeader->biHeight, lpBits, pbmi, DIB_RGB_COLORS)) {
		printf("GetDIBits error");
		return NULL;
	}

	bmpFileHeader.bfType = 0x4d42; // 0x42 = "B" 0x4d = "M" 
	// Compute the size of the entire file.
	bmpFileHeader.bfSize = (DWORD)(sizeof(BITMAPFILEHEADER) + bmpInfoHeader->biSize + bmpInfoHeader->biClrUsed * sizeof(RGBQUAD) + bmpInfoHeader->biSizeImage);
	bmpFileHeader.bfReserved1 = 0;
	bmpFileHeader.bfReserved2 = 0;

	// Compute the offset to the array of color indices. 
	bmpFileHeader.bfOffBits = (DWORD) sizeof(BITMAPFILEHEADER) + 
	bmpInfoHeader->biSize + bmpInfoHeader->biClrUsed * sizeof (RGBQUAD); 

	int len = sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER) + bmpInfoHeader->biClrUsed * sizeof(RGBQUAD) + bmpInfoHeader->biSizeImage;
	char *buf = malloc(len);
	*size = len;

	int headerlen = sizeof(BITMAPFILEHEADER);
	memcpy(buf, &bmpFileHeader, headerlen);
	int infolen = sizeof(BITMAPINFOHEADER) + bmpInfoHeader->biClrUsed * sizeof (RGBQUAD);
	memcpy(buf + headerlen, bmpInfoHeader, infolen);
	memcpy(buf + headerlen + infolen, lpBits, bmpInfoHeader->biSizeImage);

#ifdef DEBUG_WRITE_RAW
	FILE *file = fopen("debug.bmp", "wb");
	fwrite(buf, len, 1, file);
	fclose(file);
#endif

	GlobalFree((HGLOBAL)lpBits);

	return buf;
}