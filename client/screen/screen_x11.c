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
        CaptureCursor(capture);
      }
    }
  }
}

void query_cursor(Capture *capture) {
  ProcessPendingXEvents(capture);

  int root_x, root_y, win_x, win_y;
  unsigned int mask_return;
  Window window_returned;
  if (XQueryPointer(capture->dpy, capture->root, &window_returned,
                    &window_returned, &root_x, &root_y, &win_x, &win_y,
                    &mask_return)) {
    capture->cursor->x = root_x;
    capture->cursor->y = root_y;
  }
}

void capture(Capture *capture) {
  ProcessPendingXEvents(capture);

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
  if (capture->cursor) {
    XFree(capture->cursor);
    capture->cursor = NULL;
  }
  free(capture);
}

void bgra_to_rgba(XImage *image) {
  unsigned int *src = image->data;
  unsigned int *dst_end = src + image->width * image->height;

  while (src < dst_end) {
    *src++ = (0x000000FF << 24) | ((*src & 0x00FF0000) >> 16) |
             ((*src & 0x000000FF) << 16) | ((*src & 0x0000FF00));
  }
}
