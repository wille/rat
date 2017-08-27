#include <wchar.h>

typedef struct {
    wchar_t *title;
    int handle;
} Window;

// Callback function defined in Go
extern void Callback(Window window);

// Query all windows and populate windows array
void QueryWindows(void);
