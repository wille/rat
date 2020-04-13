//+build x11

#include "screen_x11.h"

Capture *init_capture() {
  Display *display = XOpenDisplay(NULL);
  if (display == NULL) {
    return;
  }

  Capture *capture = malloc(sizeof(Capture));
  capture->cursor = NULL;
  capture->image = NULL;
  capture->dpy = XOpenDisplay(NULL);
  capture->root = DefaultRootWindow(capture->dpy);

  if (capture->use_shm = XShmQueryExtension(display)) {
    capture->image = XShmCreateImage(
        capture->dpy,
        XDefaultVisual(capture->dpy, XDefaultScreen(capture->dpy)),
        DefaultDepth(capture->dpy, XDefaultScreen(capture->dpy)), ZPixmap, 0,
        &capture->shminfo, 2560, 1440);
    if (!capture->image) {
      printf(": could not allocate the XImage structure\n");
      return false;
    }

    // Create a shared memory area
    capture->shminfo.shmid = shmget(
        IPC_PRIVATE, capture->image->bytes_per_line * 1440, IPC_CREAT | 0600);
    if (capture->shminfo.shmid == -1) {
      perror("d");
      return false;
    }

    // Map the shared memory segment into the address space of this process
    capture->shminfo.shmaddr = capture->image->data =
        (char *)shmat(capture->shminfo.shmid, 0, 0);
    if (capture->shminfo.shmaddr == (char *)-1) {
      perror("s");
      return false;
    }
    capture->shminfo.readOnly = false;

    // Ask the X server to attach the shared memory segment and sync
    XShmAttach(capture->dpy, &capture->shminfo);
    XSync(capture->dpy, false);
  }

  if (XFixesQueryExtension(capture->dpy, &capture->xfixes_event_base,
                           &capture->xfixes_error_base)) {
    XFixesSelectCursorInput(capture->dpy, capture->root,
                            XFixesDisplayCursorNotifyMask);
  }

  // changes to dimensions to the root window
  // XSelectInput(display, window, StructureNotifyMask)

  CaptureCursor(capture);

  return capture;
}

void CaptureCursor(Capture *capture) {
  XFixesCursorImage *img = XFixesGetCursorImage(capture->dpy);
  if (!img) {
    return;
  }

  if (capture->cursor) {
    XFree(capture->cursor);
  }

  capture->cursor = img;
  printf("cursor captured %dx%d %dx%d %dx%d\n", img->x, img->y, img->xhot,
         img->yhot, img->width, img->height);
}

void ProcessPendingXEvents(Capture *capture) {
  int events_to_process = XPending(capture->dpy);
  XEvent e;
  for (int i = 0; i < events_to_process; i++) {
    XNextEvent(capture->dpy, &e);
    if (e.type == capture->xfixes_event_base + XFixesCursorNotify) {
      XFixesCursorNotifyEvent *cne = (XFixesCursorNotifyEvent *)&e;
      if (cne->subtype == XFixesDisplayCursorNotify) {
        // Recapture cursor
        CaptureCursor(capture);
      }
    }
  }
}

void capture(Capture *capture) {
  ProcessPendingXEvents(capture);

  Window window_returned;
  int root_x, root_y, win_x, win_y;
  unsigned int mask_return;
  if (XQueryPointer(capture->dpy, capture->root, &window_returned,
                    &window_returned, &root_x, &root_y, &win_x, &win_y,
                    &mask_return)) {
    capture->cursor->x = root_x;
    capture->cursor->y = root_y;
  }

  if (capture->use_shm) {
    XShmGetImage(capture->dpy, capture->root, capture->image, 0, 0, AllPlanes);
    bgra_to_rgba(capture->image);
  } else {
    if (capture->image)
      XDestroyImage(capture->image);

    capture->image = XGetImage(capture->dpy, capture->root, 0, 0, 2560, 1440,
                               AllPlanes, ZPixmap);

    if (capture->image) {
      bgra_to_rgba(capture->image);
    }
  }
}

void bgra_to_rgba(XImage *image) {
  unsigned int *src = image->data;
  unsigned int *dst_end = src + image->width * image->height;

  while (src < dst_end) {
    *src++ = (0x000000FF << 24) | ((*src & 0x00FF0000) >> 16) |
             ((*src & 0x000000FF) << 16) | ((*src & 0x0000FF00));
  }
}

void destroy_capture(Capture *capture) {
  if (capture->use_shm) {
    XShmDetach(capture->dpy, &capture->shminfo);

    if (capture->shminfo.shmaddr != -1)
      shmdt(capture->shminfo.shmaddr);

    if (capture->shminfo.shmid != -1)
      shmctl(capture->shminfo.shmid, IPC_RMID, 0);
  }

  if (capture->image) {
    XDestroyImage(capture->image);
    capture->image = NULL;
  }
  free(capture);
}

// //+build !windows,!darwin,x11

// #include <X11/Xlib.h>
// #include <X11/Xutil.h>
// #include <X11/extensions/Xrandr.h>

// #include <stdio.h>
// #include <stdlib.h>
// #include <string.h>

// #include "bitmap.h"
// #include "screen.h"
// #include "screen_x11.h"

// Capture CaptureWindow(int handle) {
//     Capture cap;
//     cap.error = 0;
//     cap.image = NULL;

//     Display *display = XOpenDisplay(NULL);
//     Window window = (Window) handle;

//     XWindowAttributes attr;
//     if (cap.error = XGetWindowAttributes(display, window, &attr) != Success)
//     {
//         return cap;
//     }

//     int x = attr.x;
//     int y = attr.y;
//     int width = attr.width;
//     int height = attr.height;

//     XImage *img = XGetImage(display, window, x, y, width, height, AllPlanes,
//     ZPixmap);

//     PixelSwap(img->data, width * height * 4);

//     XCloseDisplay(display);

//     cap.width = width;
//     cap.height = height;
//     cap.image = img;

// end:
//     return cap;
// }

// Capture CaptureMonitor(Monitor monitor) {
//     Capture cap;
//     cap.error = 0;

//     Display *display = XOpenDisplay(NULL);
//     Window root = DefaultRootWindow(display);

//     XImage *img = XGetImage(display, root, monitor.coordinates.x,
//     monitor.coordinates.y, monitor.coordinates.width,
//     monitor.coordinates.height, AllPlanes, ZPixmap);

//     // not using bitmap.c:PixelSwap here, need to do more testing on windows
//     and macos
//     // ensure alpha is 255 and swap R,B
//     for (int i = 0; i < monitor.coordinates.width *
//     monitor.coordinates.height * 4; i += 4) {
//         unsigned int *p = (unsigned int*) &img->data[i];
//         *p = (0xff << 24) |
//             ((*p & 0x00FF0000) >>  16) |
//             ((*p & 0x000000FF) <<  16) |
//             ((*p & 0x0000FF00));
//     }

//     XCloseDisplay(display);

//     cap.width = monitor.coordinates.width;
//     cap.height = monitor.coordinates.height;
//     cap.image = img;

//     return cap;
// }

// void DestroyImage(Capture cap) {
//     XDestroyImage(cap.image);
// }
