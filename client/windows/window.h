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
    Rect rect;
} Frame;

// Callback function defined in Go
extern void WindowCallback(Frame);

// Query all windows and populate windows array
void QueryWindows(void);

// Move window to coordinates
void SetWindowPosition(HANDLE handle, Rect rect);