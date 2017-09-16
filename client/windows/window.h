#include <stdbool.h>

#define HANDLE int

typedef struct {
    int x;
    int y;
    unsigned int width;
    unsigned int height;
} WindowRectangle;

typedef struct {
    char *title;
    HANDLE handle;
    bool visible;
    WindowRectangle rect;
} Frame;

// Callback function defined in Go
extern void WindowCallback(Frame);

// Query all windows and populate windows array
void QueryWindows(void);

void SetDisplayState(HANDLE, bool visible);