//+build darwin

#import <ApplicationServices/ApplicationServices.h>

#include "window.h"

void QueryWindows(void) {
	CFArrayRef windows = CGWindowListCopyWindowInfo(kCGWindowListExcludeDesktopElements | kCGWindowListOptionOnScreenOnly, kCGNullWindowID);	

	//CFArrayApplyFunction(windows, CFRangeMake(0, CFArrayGetCount(windows)), &ProcessWindow, NULL);

	for (NSDictionary *entry in (NSArray*) windows) {
		int number = [[entry objectForKey: (id) kCGWindowNumber] intValue];
		NSString* ownerName = [entry objectForKey: (id) kCGWindowName];

		Frame frame;
		frame.handle = number;
		frame.visible = false;
		frame.title = [ownerName UTF8String];

		WindowCallback(frame);
	}

	CFRelease(windows);
}
	
void SetDisplayState(HANDLE handle, bool visible) {
	
}