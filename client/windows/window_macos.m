//+build darwin

#import <ApplicationServices/ApplicationServices.h>

#include "window.h"

void QueryWindows(void) {
	CFArrayRef windows = CGWindowListCopyWindowInfo(kCGWindowListExcludeDesktopElements | kCGWindowListOptionOnScreenOnly, kCGNullWindowID);	

	Frame frame;
	frame.handle = 0;
	frame.visible = false;
	frame.title = "test";
	WindowCallback(frame);
}
	
void SetDisplayState(HANDLE handle, bool visible) {
	
}