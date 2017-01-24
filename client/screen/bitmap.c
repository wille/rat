//+build !windows

#include <strings.h>
#include <stdlib.h>
#include <stdio.h>

#include "bitmap.h"

char *GetBitmap(void *img, int *size, int w, int h) {
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
    int dwBmpSize = ((w * biBitCount + 31) / 32) * 4 * h;

    bmpFileHeader.bfSize = sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER) + dwBmpSize;

    bmpInfoHeader.biSize = sizeof(BITMAPINFOHEADER);
    bmpInfoHeader.biWidth = w;
    bmpInfoHeader.biHeight = h;
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
		fwrite(img, dwBmpSize, 1, fp);
		fclose(fp);
    }
#endif

    int len = sizeof(bmpFileHeader) + sizeof(bmpInfoHeader) + dwBmpSize;
    *size = len;
    char *buf = malloc(len);
    memcpy(buf, &bmpFileHeader, sizeof(bmpFileHeader));
    memcpy(buf + sizeof(bmpFileHeader), &bmpInfoHeader, sizeof(bmpInfoHeader));
    memcpy(buf + sizeof(bmpFileHeader) + sizeof(bmpInfoHeader), img, dwBmpSize);

    return buf;
}