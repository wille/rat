#include <stdbool.h>

#define HANDLE int

typedef struct {
    int x;
    int y;
    unsigned int width;
    unsigned int height;
} Rect;

typedef struct {
    char *title;
    HANDLE handle;
    bool visible;
    Rect rect;
} Frame;

// Callback function defined in Go
extern void WindowCallback(Frame);

// Query all windows and populate windows array
void QueryWindows(void);

void SetDisplayState(HANDLE, bool visible);