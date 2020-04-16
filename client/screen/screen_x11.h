#ifndef _SCREEN_X11_H
#define _SCREEN_X11_H

#include <X11/Xlib.h>
#include <X11/extensions/XShm.h>
#include <X11/extensions/Xfixes.h>

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/ipc.h>
#include <sys/shm.h>

typedef struct Capture {
  Display *dpy;
  Window root;
  XImage *image;

  int xfixes_event_base, xfixes_error_base;

  XFixesCursorImage *cursor;

  bool use_shm;
  XShmSegmentInfo shminfo;
  int x, y, width, height;
} Capture;

Capture *init_capture();
void capture(Capture *);
void destroy_capture(Capture *);
void query_cursor(Capture *);
#endif
