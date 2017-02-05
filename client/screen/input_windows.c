#include <windows.h>

#include "input.h"

typedef struct {
	int id, x, y;
} Position;

static int monitor;

BOOL CALLBACK MonitorEnumProc1(HMONITOR hMonitor, HDC hdcMonitor, LPRECT lprcMonitor, LPARAM dwData) {
	int x = lprcMonitor->left;
	int y = lprcMonitor->top;
	int w = lprcMonitor->right - x;
	int h = lprcMonitor->bottom - y;

	Position *p = (Position*)dwData;

	if (monitor++ == p->id) {
		SetCursorPos(x + p->x, y + p->y);
		return FALSE;
	}

	return TRUE;
}

void MoveCursor(int m, int x, int y) {
	Position p;
	p.id = m;
	p.x = x;
	p.y = y;

	monitor = 0;
	HDC hdc = GetDC(NULL);
	EnumDisplayMonitors(NULL, NULL, MonitorEnumProc1, (LPARAM) &p);
	ReleaseDC(NULL, hdc);
}