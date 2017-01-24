#ifndef _BITMAP_H
#define _BITMAP_H

typedef unsigned int DWORD;
typedef unsigned short WORD;

#pragma pack(1) // prevent byte aligning which will make sizeof(BITMAP...HEADER) return incorrect value
typedef struct {
    WORD bfType;
    DWORD bfSize;
    WORD bfReserved1;
    WORD bfReserved2;
    DWORD bfOffBits;
} BITMAPFILEHEADER;

typedef struct {
    DWORD biSize;
    DWORD biWidth;
    DWORD biHeight;
    WORD biPlanes;
    WORD biBitCount;
    DWORD biCompression;
    DWORD biSizeImage;
    DWORD biXPelsPerMeter;
    DWORD biYPelsPerMeter;
    DWORD biClrUsed;
    DWORD biClrImportant;
} BITMAPINFOHEADER;

char *GetBitmap(void *img, int *size, int w, int h);

#endif