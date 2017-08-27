#include <wchar.h>

typedef struct {
    int x;
    int y;
    int width;
    int height;
} Rect;

typedef struct {
    wchar_t *title;
    int handle;
    Rect rect;
} Window;


// Callback function defined in Go
extern void WindowCallback(Window window);

// Query all windows and populate windows array
void QueryWindows(void);

// Get window coordinates and dimensions
Rect GetWindowDimensions(int handle);

// Move window to coordinates
void SetWindowPosition(int handle, Rect rect);