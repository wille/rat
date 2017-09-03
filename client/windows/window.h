#define HANDLE int

typedef struct {
    int x;
    int y;
    int width;
    int height;
} Rect;

typedef struct {
    char *title;
    HANDLE handle;
    Rect rect;
} Frame;

// Callback function defined in Go
extern void WindowCallback(Frame);

// Query all windows and populate windows array
void QueryWindows(void);

// Get window coordinates and dimensions
Rect GetWindowDimensions(HANDLE handle);

// Move window to coordinates
void SetWindowPosition(HANDLE handle, Rect rect);