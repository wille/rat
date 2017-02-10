#include <windows.h>

#include "input.h"

typedef struct {
	int id; // id of monitor
	void *param; // pointer to data required by callback function
	void (*func)(int, int, void*); // callback function (x, y, param)
} Param;

static int monitor;

BOOL CALLBACK MonitorEnumProc1(HMONITOR hMonitor, HDC hdcMonitor, LPRECT lprcMonitor, LPARAM dwData) {
	int x = lprcMonitor->left;
	int y = lprcMonitor->top;
	int w = lprcMonitor->right - x;
	int h = lprcMonitor->bottom - y;

	Param *p = (Param*) dwData;

	if (monitor++ == p->id) { // found our monitor, invoke callback function with monitor coordinates
		p->func(x, y, p->param);

		return FALSE;
	}

	return TRUE;
}

// Loop monitors and run callback function on monitor with id param->id
static void runOnMonitor(Param *param) {
	monitor = 0;
	HDC hdc = GetDC(NULL);
	EnumDisplayMonitors(NULL, NULL, MonitorEnumProc1, (LPARAM) param);
	ReleaseDC(NULL, hdc);
}

static void mouseMove(int x, int y, void *param) {
	Coordinates *p = (Coordinates*)param;
	SetCursorPos(x + p->x, y + p->y);
}

void MoveCursor(int m, int x, int y) {
	Coordinates p;
	p.x = x;
	p.y = y;

	Param param;
	param.id = m;
	param.param = &p;
	param.func = &mouseMove;

	runOnMonitor(&param);	
}

static void mouseClick(int x, int y, void *param) {
	ClickEvent *data = (ClickEvent*)param;

	DWORD type;

	if (data->button == LEFT) {
		switch (data->type) {
			case PRESS:
				type = MOUSEEVENTF_LEFTDOWN;
				break;
			case RELEASE:
				type = MOUSEEVENTF_LEFTUP;
				break;
		}
	} else if (data->button == RIGHT) {
		switch (data->type) {
			case PRESS:
				type = MOUSEEVENTF_RIGHTDOWN;
				break;
			case RELEASE:
				type = MOUSEEVENTF_RIGHTUP;
				break;
		}
	} else if (data->button == MIDDLE) {
		switch (data->type) {
			case PRESS:
				type = MOUSEEVENTF_MIDDLEDOWN;
				break;
			case RELEASE:
				type = MOUSEEVENTF_MIDDLEUP;
				break;
		}
	}

	INPUT event;
	event.type = INPUT_MOUSE;
	event.mi.dwFlags = type;
	SendInput(1, &event, sizeof(INPUT));
}

void Mouse(int m, int button, int type) {
	ClickEvent event;
	event.button = button;
	event.type = type;

	Param p;
	p.id = m;
	p.func = &mouseClick;
	p.param = &event;

	runOnMonitor(&p);
}

void Key(unsigned short key, int t) {
	DWORD type;

	switch (t) {
		case PRESS:
			type = 0;
			break;
		case RELEASE:
			type = KEYEVENTF_KEYUP;
			break;
	}

	INPUT event;
	event.type = INPUT_KEYBOARD;
	event.ki.wVk = (WORD) key;
	event.ki.wScan = 0;
	event.ki.dwFlags = type;
	SendInput(1, &event, sizeof(INPUT));
}