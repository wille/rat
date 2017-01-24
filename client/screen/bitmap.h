#ifndef _BITMAP_H
#define _BITMAP_H

#pragma pack(1)
typedef struct {
    short bfType;
    int bfSize;
    short bfReserved1;
    short bfReserved2;
    int bfOffBits;
} BITMAPFILEHEADER;

typedef struct {
    int biSize;
    int biWidth;
    int biHeight;
    short biPlanes;
    short biBitCount;
    int biCompression;
    int biSizeImage;
    int biXPelsPerMeter;
    int biYPelsPerMeter;
    int biClrUsed;
    int biClrImportant;
} BITMAPINFOHEADER;

char *GetBitmap(void *img, int *size, int w, int h);

#endif