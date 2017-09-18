#include "bitmap.h"

void PixelSwap(char *data, int len) {
	for (int i = 0; i < len; i += 4) {
        int r = data[i];
        int b = data[i + 2];
    
        data[i] = b;
        data[i + 2] = r;        
    }
}