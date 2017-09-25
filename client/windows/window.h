#include <stdbool.h>

#define HANDLE int

typedef struct {
    int x;
    int y;
    unsigned int width;
    unsigned int height;
} WindowRectangle;

typedef struct {
    int width;
    int height;
    unsigned char *data;
} Icon;

typedef struct {
    char *title;
    HANDLE handle;
    bool visible;
    WindowRectangle rect;
    Icon icon;
} Frame;

// Callback function defined in Go
extern void WindowCallback(Frame);

// Query all windows and populate windows array
void QueryWindows(void);

void SetDisplayState(HANDLE, bool visible);