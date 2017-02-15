//+build linux

#include <X11/Xlib.h>

#include <string.h>
#include <stdlib.h>

#include "input.h"

typedef struct {
	unsigned short keycode;
	int type;
} KeyEvent;

static void Invoke(int m, void *param, void (*func)(Display*, Window, void*)) {
	Display *display;
    Screen *screen;
    Window root;
    display = XOpenDisplay(NULL);
	
	int screen_count = ScreenCount(display);
	int i;
	for (i = 0; i < screen_count; i++) {
		screen = ScreenOfDisplay(display, i);
		int screen_number = *(int*)screen;

		root = RootWindow(display, screen_number);
		
		if (screen_number == m) {
			func(display, root, param);
			break;
		}
	}

	XCloseDisplay(display);
}

static void moveCursor(Display *display, Window root, void *param) {
	Coordinates *point = (Coordinates*)param;
	XSelectInput(display, root, KeyReleaseMask);
	XWarpPointer(display, None, root, 0, 0, 0, 0, point->x, point->y);
}

void MoveCursor(int m, int x, int y) {
	Coordinates p;
	p.x = x;
	p.y = y;
	Invoke(m, &p, &moveCursor);	
}

static void mouseClick(Display *display, Window root, void *eventptr) {
	ClickEvent *ce = (ClickEvent*)eventptr;
	
	XEvent event;	
	event.type = ce->type;
	event.xbutton.button = ce->button;
	event.xbutton.same_screen = True;
	
	if (XSendEvent(display, root, True, 0xfff, &event) == 0) {
		perror("ERROR");
	}

	XFlush(display);
}

void Mouse(int m, int button, int type) {
	switch (button) {
		case LEFT:
			button = Button1;
			break;
		case RIGHT:
			button = Button2;
			break;
		case MIDDLE:
			button = Button3;
			break;
	}

	switch (type) {
		case PRESS:
			type = ButtonPress;
			break;
		case RELEASE:
			type = ButtonRelease;
			break;
	}

	ClickEvent event;
	event.button = button;
	event.type = type;
	Invoke(m, &event, &mouseClick);
}

static void keyEvent(Display *display, Window root, void *param) {
	KeyEvent *key = (KeyEvent*) param;

	XEvent ev;
	ev.type = KeyPress;
    ev.xkey.state = ShiftMask;
    ev.xkey.keycode = key->keycode;
    ev.xkey.same_screen = True;

    if (XSendEvent(display, root, True, KeyPressMask, &ev) == 0) {
		perror("ERROR");
	}
	XFlush(display);
}

void Key(unsigned short key, int t) {
	switch (t) {
		case PRESS:
			t = KeyPress;
			break;
		case RELEASE:
			t = KeyRelease;
			break;
	}

	KeyEvent event;
	event.keycode = key;
	event.type = t;

	Invoke(0, &event, &keyEvent);
}